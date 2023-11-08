import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import type { structuredNextApiHandler } from "@/libs/server/request-validator";
import type { TweetCategory } from "@prisma/client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

interface TweetUploadForm {
  name: string;
  category: TweetCategory;
  description: string;
  imagepath?: string;
  showLocation: "" | "1";
  latitude: number;
  longitude: number;
}

const handler: structuredNextApiHandler = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(404).json({ ok: false, error: "로그인을 먼저 해주세요" });
  }

  switch (req.method) {
    case "GET":
      const tweets = await client.tweet.findMany({
        select: {
          name: true,
          id: true,
          comments: {
            select: {
              id: true,
            },
          },
          likes: true,
          category: true,
          showLocation: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          description: true,
          tweets: {
            select: {
              id: true,
              name: true,
              userId: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      if (!tweets) {
        return res.status(500).json({
          ok: false,
          error: HTTPMESSAGE.STATUS500("Tweet 목록 조회 실패"),
        });
      }
      return res.status(202).json({ ok: true, data: tweets });
    case "POST":
      const {
        name,
        description,
        category,
        showLocation,
        imagepath,
        latitude,
        longitude,
      } = req.body as TweetUploadForm;

      if (!(name && description && category)) {
        return res.status(404).json({
          ok: false,
          error: "name, category, description 이 입력되지 않았어요.",
        });
      }
      const { newTweet } = await client.$transaction(async (client) => {
        const newTweet = await client.tweet.create({
          data: {
            name,
            description,
            category,
            showLocation: Boolean(showLocation),
            latitude,
            longitude,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        const newActivity = await client.activityLog.create({
          data: {
            type: "Tweet",
            placeId: newTweet.id,
            user: {
              connect: { id: user.id },
            },
          },
        });
        return { newTweet, newActivity };
      });

      if (!newTweet) {
        return res
          .status(500)
          .json({ ok: false, error: HTTPMESSAGE.STATUS500("트윗 작성 실패") });
      }

      return res.status(202).json({ ok: true, data: `${newTweet.id}` });
  }
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST", "GET"], handler })
);