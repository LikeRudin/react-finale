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
        async getMyProfile(id: number) {
          const profile = await client.user.findUnique({
            where: { id },
            include: {
              activityLogs: { take: 10, orderBy: { createdAt: "desc" } },
              notifications: { take: 10, orderBy: { createdAt: "desc" } },
            },
          });
          if (!profile) {
            return null;
          }
          return profile;
        },
        async getEditProfile(id: number) {
          const profile = await client.user.findUnique({
            where: { id },
          });
          if (!profile) {
            return null;
          }
          return profile;
        },
        async getOtherProfile(id: number) {
          const profile = await client.user.findUnique({
            where: { id },
            include: { tweets: true, meetUps: true },
          });
          if (!profile) {
            return null;
          }
          return profile;
        },
      },
      meetUp: {
        async getMeetUpDetail(id: number, userId: number) {
          const meetUp = await client.meetUp.findUnique({
            where: {
              id,
            },
            include: {
              user: true,
              comments: {
                include: {
                  parent: true,
                  user: {
                    select: {
                      id: true,
                      avatar: true,
                      username: true,
                    },
                  },
                  likes: {
                    select: {
                      id: true,
                      userId: true,
                    },
                  },
                  comments: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          avatar: true,
                          username: true,
                        },
                      },
                      likes: {
                        select: {
                          id: true,
                          userId: true,
                        },
                      },
                    },
                  },
                },
              },
              likes: {
                include: {
                  user: { select: { id: true, username: true } },
                },
              },
              joins: {
                include: {
                  user: { select: { id: true, username: true } },
                },
              },
            },
          });
          if (!meetUp) {
            return null;
          }
          const isLiked = meetUp.likes.some((like) => like.userId === userId);
          const isJoined = meetUp.joins.some((join) => join.userId === userId);

          return { meetUp, isLiked, isJoined };
        },
      },
      tweet: {
        async getTweetDetail(id: number, userId: number) {
          const tweet = await client.tweet.findUnique({
            where: {
              id,
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
              likes: {
                include: {
                  user: { select: { id: true, username: true } },
                },
              },
              parent: {
                select: {
                  id: true,
                  name: true,
                  user: {
                    select: { username: true },
                  },
                },
              },
              comments: {
                include: {
                  parent: true,
                  user: {
                    select: {
                      id: true,
                      avatar: true,
                      username: true,
                    },
                  },
                  likes: {
                    select: {
                      id: true,
                      userId: true,
                    },
                  },
                  comments: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          avatar: true,
                          username: true,
                        },
                      },
                      likes: {
                        select: {
                          id: true,
                          userId: true,
                        },
                      },
                    },
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
