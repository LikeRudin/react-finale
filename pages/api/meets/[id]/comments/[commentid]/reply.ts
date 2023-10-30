import { structuredNextApiHandler } from "@/libs/server/request-validator";
import withSessionApiRoute from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id, commentid },
    session: { user },
    body: { reply, parentId },
  } = req;
  if (!(id && user && reply && parentId && commentid)) {
    return res
      .status(404)
      .json({ ok: false, error: "잘못된 접근 요청입니다." });
  }

  const meetUp = await client.meetUp.findUnique({
    where: {
      id: +id.toString(),
    },
  });
  if (!meetUp) {
    return res.status(404).json({ ok: false, error: "삭제된 MeetUp입니다." });
  }

  const transaction = await client.$transaction([
    client.meetUpComment.create({
      data: {
        text: reply as string,
        user: {
          connect: {
            id: user.id,
          },
        },
        parent: {
          connect: {
            id: +parentId.toString(),
          },
        },
        meetUp: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    }),
    client.activityLog.create({
      data: {
        type: "MeetUpComment",
        placeId: +id.toString(),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
    client.notification.create({
      data: {
        type: "MeetUpComment",
        senderId: user.id,
        placeId: +id.toString(),
        receiver: {
          connect: { id: meetUp.userId },
        },
      },
    }),
    client.notification.create({
      data: {
        type: "MeetUpCommentReply",
        senderId: user.id,
        placeId: +id.toString(),
        receiver: {
          connect: { id: meetUp.userId },
        },
      },
    }),
  ]);
  if (!transaction) {
    res.status(500).json({ ok: false, error: "알수없는 오류가 발생했습니다." });
  }

  return res.status(202).json({ ok: true, data: reply });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler })
);
