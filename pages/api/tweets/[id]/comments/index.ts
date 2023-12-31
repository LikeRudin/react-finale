import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id },
    session: { user },
    body: { reply },
  } = req;
  if (!(id && user && reply)) {
    return res.status(404).json({
      ok: false,
      error: HTTPMESSAGE.STATUS404("reply를 확인해보세요"),
    });
  }
  const tweet = await client.tweet.findUnique({
    where: {
      id: +id.toString(),
    },
  });
  if (!tweet) {
    return res.status(404).json({
      ok: false,
      error: HTTPMESSAGE.STATUS404("존재하지 않는 Tweet 입니다."),
    });
  }

  const transaction = await client.$transaction([
    client.tweet.update({
      where: { id: +id.toString() },
      data: {
        comments: {
          create: {
            text: reply,
            user: {
              connect: {
                id: user.id,
              },
            },
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
  ]);
  if (!transaction) {
    res.status(500).json({ ok: false, error: "알수없는 오류가 발생했습니다." });
  }

  return res.status(202).json({ ok: true, data: reply });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler })
);
