import type { structuredNextApiHandler } from "@/libs/server/request-validator";
import validateAndHandleRequest from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";

import client from "@/libs/server/prisma-client";
import type { User } from "@prisma/client";

const handler: structuredNextApiHandler = async (req, res) => {
  const { id } = req.session.user as User;
  const { password } = req.body;
  const user = await client.user.login({ password, id });
  if (!user) {
    return res
      .status(404)
      .json({ ok: false, error: "비밀번호가 일치하지 않습니다." });
  }
  req.session.user = user;

  req.cookies.user = JSON.stringify(user);

  await req.session.save();
  return res.status(202).json({ ok: true, data: "로그인에 성공했습니다." });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler, isPrivate: false })
);
