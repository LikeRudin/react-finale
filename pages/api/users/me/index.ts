import { structuredNextApiHandler } from "@/libs/server/request-validator";
import withSessionApiRoute from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET": {
      const profile = await client.user.findUnique({
        where: { id: req.session.user?.id },
      });
      if (!profile) {
        return res
          .status(500)
          .json({ ok: false, error: "유저 정보를 찾을 수 없습니다." });
      }
      return res.status(202);
    }
    case "POST": {
      return res
        .status(500)
        .json({ ok: false, error: "아직 지원하지 않는 기능입니다," });
    }
  }
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["GET", "POST"], handler })
);
