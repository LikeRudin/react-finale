import type { structuredNextApiHandler } from "@/libs/server/request-validator";
import validateAndHandleRequest from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";

const handler: structuredNextApiHandler = async (req, res) => {
  const { user } = req.session;
  const isLoggedIn = user?.password;

  if (isLoggedIn) {
    return res.status(200).json({ ok: true, data: "로그인 상태입니다." });
  }
  return res.status(401).json({ ok: false, error: "로그아웃 상태입니다." });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["GET"], handler, isPrivate: false })
);
