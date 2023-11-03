import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id: meetUpId, commentid },
    session: { user },
  } = req;

  if (!(meetUpId && commentid && user)) {
    return res
      .status(404)
      .json({ ok: false, error: HTTPMESSAGE.STATUS404 + "댓글" });
  }
  switch (req.method) {
    case "DELETE":
      const deleteTransaction = await client.$transaction([
        client.meetUpComment.delete({
          where: { id: +commentid.toString() },
        }),
        client.activityLog.create({
          data: {
            type: "MeetUpCommentDelete",
            placeId: +meetUpId.toString(),
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
        client.meetUpComment.update({
          where: {
            id: +commentid.toString(),
          },
          data: {
            text: edit,
          },
        }),
        client.activityLog.create({
          data: {
            type: "MeetUpCommentEdit",
            placeId: +meetUpId.toString(),
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
          .json({ ok: false, error: HTTPMESSAGE.STATUS500 });
      }
      return res
        .status(202)
        .json({ ok: true, data: "성공적으로 수정했습니다." });
  }
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST", "DELETE"], handler })
);
