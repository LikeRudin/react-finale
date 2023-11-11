import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
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

  const tweet = await client.tweet.findUnique({
    where: {
      id: +id.toString(),
    },
  });
  if (!tweet) {
    return res.status(404).json({ ok: false, error: "삭제된 Tweet입니다." });
  }

  const likeExist = await client.tweetLike.findFirst({
    where: {
      tweetId: +id.toString(),
      userId: user.id,
    },
  });

  if (likeExist) {
    await client.tweetLike.delete({
      where: {
        id: likeExist.id,
      },
    });
    return res.status(202).json({ ok: true, data: "좋아요를 취소했습니다." });
  }

  const transaction = await client.$transaction([
    client.tweetLike.create({
      data: {
        user: {
          connect: {
            id: +user.id,
          },
        },
        tweet: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    }),
    client.activityLog.create({
      data: {
        type: "TweetLike",
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
        type: "TweetLike",
        senderId: user.id,
        placeId: +id.toString(),
        receiver: {
          connect: { id: tweet.userId },
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
