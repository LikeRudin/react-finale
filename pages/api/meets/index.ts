import { structuredNextApiHandler } from "@/libs/server/request-validator";
import withSessionApiRoute from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

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
    return res.status(404).json({ ok: false, error: "로그인을 먼저 해주세요" });
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
      .json({ ok: false, error: "알수없는 오류로 업로드에 실패했습니다." });
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
      .json({ ok: false, error: "알수없는 오류로 업로드에 실패했습니다." });
  }

  return res.status(202).json({ ok: true, data: `${newMeetUp.id}` });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler })
);
