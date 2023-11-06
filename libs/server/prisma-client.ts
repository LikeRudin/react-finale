import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const createClient = () => {
  const client = new PrismaClient().$extends({
    name: "custom-client",
    model: {
      user: {
        async createUser({
          email,
          phone,
          password,
          username,
        }: {
          [key: string]: string;
        }) {
          const hashedPassword = await bcrypt.hash(password, 10);
          return client.user.create({
            data: {
              email,
              phone,
              username,
              password: hashedPassword,
            },
          });
        },
        async login({ password, id }: { password: string; id: number }) {
          const user = await client.user.findUnique({
            where: { id },
          });
          if (user) {
            const passwordConfirm = await bcrypt.compare(
              password,
              user.password
            );
            if (passwordConfirm) {
              return user;
            }
          }
          return null;
        },
      },
      tweet: {
        async getTweetDetail(id: number, userId: number) {
          const tweet = await client.tweet.findUnique({
            where: {
              id: +id.toString(),
            },
            include: {
              user: {
                select: {
                  username: true,
                },
              },
              likes: {
                select: {
                  userId: true,
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              tweets: true,
              comments: {
                select: {
                  id: true,
                  createdAt: true,
                  text: true,
                  user: {
                    select: {
                      id: true,
                      avatar: true,
                      username: true,
                    },
                  },
                  parent: true,
                  parentId: true,
                  likes: true,
                  comments: {
                    include: { user: true, likes: true, comments: true },
                  },
                },
              },
            },
          });
          if (!tweet) {
            return null;
          }
          const isLiked = tweet.likes.some((item) => item.userId === userId);
          return { tweet, isLiked };
        },
      },
    },
  });
  return client;
};

type clientType = ReturnType<typeof createClient>;

declare global {
  var client: clientType | undefined;
}

const client = global.client || createClient();

if (process.env.NODE_ENV === "development") {
  global.client = client;
}

export default client;
