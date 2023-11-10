import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

interface MeetUpDatas {
  name: string;
  schedule: string;
  description: string;
  location: string;
  imagepath?: string;
}

const handler: structuredNextApiHandler = async (req, res) => {
  const { name, location, schedule, description, imagepath } =
    req.body as MeetUpDatas;
  const user = req.session.user;
  if (!user) {
    return res.status(404).json({
      ok: false,
      error: HTTPMESSAGE.STATUS404("로그인한 사용자가 아닙니다."),
    });
  }

  switch (req.method) {
    case "GET":
      const {
        query: { page, pageSize },
      } = req;

      const validPage = page ? +page.toString() : 0;
      const validPageSize = pageSize ? +pageSize.toString() : 10;

      const meetUps = await client.meetUp.findMany({
        take: validPageSize,
        skip: (validPage - 1) * validPageSize,
        select: {
          id: true,
          name: true,
          createdAt: true,
          schedule: true,
          isOpened: true,
          location: true,
          user: {
            select: { username: true, avatar: true, id: true },
          },
          comments: {
            select: {
              id: true,
            },
          },
          likes: {
            select: {
              id: true,
            },
          },
          joins: {
            select: {
              id: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
      if (!meetUps) {
        return res.status(500).json({
          ok: false,
          error: HTTPMESSAGE.STATUS500("meetUpLoading에 실패했습니다."),
        });
      }
      return res.status(200).json({ ok: true, data: meetUps });

    case "POST":
      const { meetUp, activityLog } = await client.$transaction(
        async (client) => {
          const meetUp = await client.meetUp.create({
            data: {
              name,
              schedule,
              location,
              description,
              user: {
                connect: { id: user.id },
              },
            },
          });

          const activityLog = await client.activityLog.create({
            data: {
              type: "MeetUp",
              placeId: meetUp.id,
              user: {
                connect: { id: user.id },
              },
            },
          });
          return { meetUp, activityLog };
        }
      );

      if (!(meetUp && activityLog)) {
        return res.status(500).json({
          ok: false,
          error: HTTPMESSAGE.STATUS500("meetUp 작성 실패"),
        });
      }
      return res.status(202).json({ ok: true, data: `${meetUp.id}` });
  }
};
export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST", "GET"], handler })
);
