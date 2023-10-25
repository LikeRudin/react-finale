import { structuredNextApiHandler } from "@/libs/server/request-validator";
import withSessionApiRoute from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id },
    session: { user },
  } = req;

  if (!(id && user)) {
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

  const likeExist = await client.meetUpLike.findFirst({
    where: {
      meetUpId: +id.toString(),
      userId: user.id,
    },
  });

  if (likeExist) {
    await client.meetUpLike.delete({
      where: {
        id: likeExist.id,
      },
    });
    return res.status(202).json({ ok: true, data: "좋아요를 취소했습니다." });
  }

  const transaction = await client.$transaction([
    client.meetUpLike.create({
      data: {
        user: {
          connect: {
            id: +user.id,
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
        type: "MeetUpLike",
        user: {
          connect: {
            id: user.id,
          },
        },
        placeId: +id.toString(),
      },
    }),
    client.notification.create({
      data: {
        type: "MeetUpLike",
        senderId: user.id,
        placeId: +id.toString(),
        receiver: {
          connect: { id: meetUp.userId },
        },
      },
    }),
  ]);

  if (!transaction) {
    return res
      .status(500)
      .json({ ok: false, error: "알수없는 오류가 발생했습니다." });
  }

  return res.status(202).json({ ok: true, data: "좋아요" });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler })
);
