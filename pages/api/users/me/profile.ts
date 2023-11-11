import type { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const { user } = req.session;
  if (!user) {
    return res.status(404).json({
      ok: false,
      error: HTTPMESSAGE.STATUS404("먼저 로그인 해 주세요 "),
    });
  }
  const id = +user?.id.toString();
  const profile = await client.user.getMyProfile(id);
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
