import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id, commentid },
    session: { user },
    body: { reply, parentId },
  } = req;
  if (!(id && user && reply && parentId && commentid)) {
    return res
      .status(404)
      .json({ ok: false, error: HTTPMESSAGE.STATUS404("") });
  }

  const tweet = await client.tweet.findUnique({
    where: {
      id: +id.toString(),
    },
  });
  if (!tweet) {
    return res.status(404).json({ ok: false, error: "삭제된 Tweet입니다." });
  }

  const transaction = await client.$transaction([
    client.tweetComment.create({
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
        tweet: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    }),
    client.activityLog.create({
      data: {
        type: "TweetComment",
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
        type: "TweetComment",
        senderId: user.id,
        placeId: +id.toString(),
        receiver: {
          connect: { id: tweet.userId },
        },
      },
    }),
    client.notification.create({
      data: {
        type: "TweetCommentReply",
        senderId: user.id,
        placeId: +id.toString(),
        receiver: {
          connect: { id: tweet.userId },
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
