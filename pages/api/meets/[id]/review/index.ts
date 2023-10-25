import { structuredNextApiHandler } from "@/libs/server/request-validator";
import withSessionApiRoute from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id },
    session: { user },
    body: { review },
  } = req;
  if (!(id && user && review)) {
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
  const newReview = await client.review.create({
    data: {
      text: review,
      user: {
        connect: {
          id: user.id,
        },
      },
      meetUp: {
        connect: {
          id: +id.toString(),
        },
      },
    },
  });
  if (!newReview) {
    return res
      .status(500)
      .json({ ok: false, error: "알 수 없는 오류가 발생했습니다." });
  }

  const transaction = await client.$transaction([
    client.activityLog.create({
      data: {
        type: "Review",
        placeId: newReview.id,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
    client.notification.create({
      data: {
        type: "Review",
        senderId: user.id,
        placeId: newReview.id,
        receiver: {
          connect: { id: meetUp.userId },
        },
      },
    }),
  ]);
  if (!transaction) {
    res.status(500).json({ ok: false, error: "알수없는 오류가 발생했습니다." });
  }

  return res.status(202).json({ ok: true, data: newReview.id });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler })
);
