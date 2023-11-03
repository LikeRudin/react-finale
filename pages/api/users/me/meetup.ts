import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = async (req, res) => {
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
    include: {
      meetUpLikes: {
        select: {
          meetUpId: true,
        },
      },
    },
  });
  if (!profile) {
    return res
      .status(500)
      .json({ ok: false, error: "유저 정보를 찾을 수 없습니다." });
  }
  return res.status(202).json({ ok: true, data: profile });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["GET"], handler })
);
