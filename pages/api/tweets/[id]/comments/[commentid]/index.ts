import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id: tweetId, commentid: commentId },
    session: { user },
  } = req;

  if (!(tweetId && commentId && user)) {
    return res
      .status(404)
      .json({ ok: false, error: HTTPMESSAGE.STATUS404("잘못된 접근입니다.") });
  }
  switch (req.method) {
    case "DELETE":
      const deleteTransaction = await client.$transaction([
        client.tweetComment.delete({
          where: { id: +commentId.toString() },
        }),
        client.activityLog.create({
          data: {
            type: "TweetCommentDelete",
            placeId: +tweetId.toString(),
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
      ]);
      if (!deleteTransaction) {
        return res
          .status(500)
          .json({ ok: false, error: HTTPMESSAGE.STATUS500 });
      }
      return res.status(202).json({ ok: true, data: "댓글을 삭제했습니다." });

    case "POST":
      const { edit } = req.body;
      if (!edit) {
        return res
          .status(404)
          .json({ ok: false, error: HTTPMESSAGE.STATUS404 });
      }
      const postTransaction = await client.$transaction([
        client.tweetComment.update({
          where: {
            id: +commentId.toString(),
          },
          data: {
            text: edit,
          },
        }),
        client.activityLog.create({
          data: {
            type: "TweetCommentEdit",
            placeId: +tweetId.toString(),
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
      ]);
      if (!postTransaction) {
        return res
          .status(500)
          .json({ ok: false, error: HTTPMESSAGE.STATUS500("트윗 수정 실패") });
      }
      return res
        .status(202)
        .json({ ok: true, data: "성공적으로 수정했습니다." });
  }
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST", "DELETE"], handler })
);
