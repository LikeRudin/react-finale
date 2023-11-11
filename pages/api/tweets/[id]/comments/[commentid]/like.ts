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
      .json({ ok: false, error: HTTPMESSAGE.STATUS404("좋아요 실패") });
  }

  const comment = await client.tweetComment.findUnique({
    where: {
      id: +commentId.toString(),
    },
  });
  if (!comment) {
    return res.status(404).json({ ok: false, error: "삭제된 comment입니다." });
  }

  const likeExist = await client.tweetCommentLike.findFirst({
    where: {
      commentId: +commentId.toString(),
      userId: user.id,
    },
  });

  if (likeExist) {
    await client.tweetCommentLike.delete({
      where: {
        id: likeExist.id,
      },
    });
    return res.status(202).json({ ok: true, data: "좋아요를 취소했습니다." });
  }

  const transaction = await client.$transaction([
    client.tweetCommentLike.create({
      data: {
        user: {
          connect: {
            id: +user.id,
          },
        },
        comment: {
          connect: {
            id: +commentId.toString(),
          },
        },
      },
    }),
    client.activityLog.create({
      data: {
        type: "TweetCommentLike",
        user: {
          connect: {
            id: user.id,
          },
        },
        placeId: +tweetId.toString(),
      },
    }),
    client.notification.create({
      data: {
        type: "TweetCommentLike",
        senderId: user.id,
        placeId: +tweetId.toString(),
        receiver: {
          connect: { id: comment.userId },
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
