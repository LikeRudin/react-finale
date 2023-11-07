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
    return res
      .status(404)
      .json({
        ok: false,
        error: HTTPMESSAGE.STATUS404("로그인한 사용자가 아닙니다."),
      });
  }

  const newMeetUp = await client.meetUp.create({
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

  if (!newMeetUp) {
    return res
      .status(500)
      .json({ ok: false, error: HTTPMESSAGE.STATUS500(" 게시물 Create 실패") });
  }

  const newActivity = await client.activityLog.create({
    data: {
      type: "MeetUp",
      placeId: newMeetUp.id,
      user: {
        connect: { id: user.id },
      },
    },
  });

  if (!newActivity) {
    await client.meetUp.delete({
      where: { id: newMeetUp.id },
    });
    return res
      .status(500)
      .json({ ok: false, error: HTTPMESSAGE.STATUS500(" 활동로그 생성 실패") });
  }

  return res.status(202).json({ ok: true, data: `${newMeetUp.id}` });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler })
);
