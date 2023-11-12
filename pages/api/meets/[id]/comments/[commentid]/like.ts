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
      .json({ ok: false, error: HTTPMESSAGE.STATUS404("") });
  }

  const comment = await client.meetUpComment.findUnique({
    where: {
      id: +commentid.toString(),
    },
  });
  if (!comment) {
    return res.status(404).json({ ok: false, error: "삭제된 comment입니다." });
  }

  const likeExist = await client.meetUpCommentLike.findFirst({
    where: {
      commentId: +commentid.toString(),
      userId: user.id,
    },
  });

  if (likeExist) {
    await client.meetUpCommentLike.delete({
      where: {
        id: likeExist.id,
      },
    });
    return res.status(202).json({ ok: true, data: "좋아요를 취소했습니다." });
  }

  const transaction = await client.$transaction([
    client.meetUpCommentLike.create({
      data: {
        user: {
          connect: {
            id: +user.id,
          },
        },
        comment: {
          connect: {
            id: +commentid.toString(),
          },
        },
      },
    }),
    client.activityLog.create({
      data: {
        type: "MeetUpCommentLike",
        user: {
          connect: {
            id: user.id,
          },
        },
        placeId: +meetUpId.toString(),
      },
    }),
    client.notification.create({
      data: {
        type: "MeetUpCommentLike",
        senderId: user.id,
        placeId: +meetUpId.toString(),
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
