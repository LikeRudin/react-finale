import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;

  if (!id) {
    return res.status(404).json({ ok: false, error: "잘못된 접근입니다." });
  }

  const user = req.session.user;
  if (!user) {
    return res.status(404).json({ ok: false, error: "로그인을 먼저 해주세요" });
  }

  switch (req.method) {
    case "GET":
      const result = await client.tweet.getTweetDetail(+id.toString(), user.id);

      if (!result) {
        return res.status(404).json({
          ok: false,
          error: HTTPMESSAGE.STATUS404("존재하지 않는 Tweet 입니다."),
        });
      }
      const { tweet, isLiked } = result;

      return res.status(202).json({ ok: true, data: { tweet, isLiked } });

    case "PUT":
      if (+id!.toString() !== user.id) {
        return res.status(404).json({
          ok: false,
          error: HTTPMESSAGE.STATUS404(
            " Tweet은 작성자 본인만 수정할 수있습니다."
          ),
        });
      }
      const {
        body: {
          name,
          location,
          showLocation,
          latitude,
          longitude,
          description,
          imagepath,
        },
      } = req;
      if (!(name && location && description)) {
        return res.status(404).json({
          ok: false,
          error: "name, 그리고 description을 빠짐없이 작성해주세요",
        });
      }
      const transaction = await client.$transaction([
        client.tweet.update({
          where: { id: +id.toString() },
          data: {
            name,
            showLocation,
            description,
            latitude,
            longitude,
          },
        }),
        client.activityLog.create({
          data: {
            type: "TweetEdit",
            placeId: +id.toString(),
            user: {
              connect: { id: user.id },
            },
          },
        }),
      ]);

      if (!transaction) {
        return res.status(500).json({
          ok: false,
          error: "알수없는 오류로 수정에 실패했습니다.",
        });
      }
      return res.status(202).json({ ok: true, data: id });

    case "DELETE":
      if (+id.toString() !== user.id) {
        return res.status(404).json({
          ok: false,
          error: "Tweet 게시글 작성자 본인만 삭제할 수 있습니다.",
        });
      }
      const deleted = await client.tweet.delete({
        where: { id: +id.toString() },
      });
      if (!deleted) {
        return res
          .status(500)
          .json({ ok: false, error: HTTPMESSAGE.STATUS500("Tweet 삭제 실패") });
      }
      return res.status(202).json({ ok: true, data: deleted });
  }
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["PUT", "DELETE", "GET"], handler })
);
