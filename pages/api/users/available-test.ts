import type { structuredNextApiHandler } from "@/libs/server/request-validator";
import validateAndHandleRequest from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";

import client from "@/libs/server/prisma-client";
import type { User } from "@prisma/client";

const handler: structuredNextApiHandler = async (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    console.log(emailOrPhone);
    return res.status(400).json({
      ok: false,
      error: "올바른 형식의 Email 또는 전화번호를 입력해야 합니다",
    });
  }

  const emailExp = /\S+@\S+\.\S+/;
  const phoneExp = /^\d+$/;
  const [chosenId] = [emailExp, phoneExp].filter((regex) =>
    regex.test(emailOrPhone)
  );

  if (!chosenId) {
    return res.status(404).json({
      ok: false,
      error: "올바른 형식의 Email 또는 전화번호를 입력해야 합니다",
    });
  }
  const whereOption = (
    chosenId === emailExp ? { email: emailOrPhone } : { phone: emailOrPhone }
  ) as { email: string } | { phone: string };

  const user = await client.user.findUnique({
    where: whereOption,
  });
  if (user) {
    return res.status(404).json({
      ok: false,
      error: "이미 사용중인 Email/전화번호입니다. 다른 정보를 입력해주세요.",
    });
  }
  req.session.user = whereOption as User;
  await req.session.save();
  return res.status(202).json({ ok: true, data: whereOption });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler, isPrivate: false })
);
