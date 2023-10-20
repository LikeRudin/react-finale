import validateAndHandleRequest, {
  structuredNextApiHandler,
} from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import withSessionApiRoute from "@/libs/server/session";
export const handler: structuredNextApiHandler = async (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
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
  const whereOption =
    chosenId === emailExp ? { email: emailOrPhone } : { phone: emailOrPhone };

  const user = await client.user.findUnique({
    where: whereOption,
  });
  if (user) {
    return res.status(404).json({
      ok: false,
      error: "이미 사용중인 Email/전화번호입니다. 다른 정보를 입력해주세요.",
    });
  }
  return res.status(202).json({ ok: true, data: emailOrPhone });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler, isPrivate: false })
);
