import validateAndHandleRequest, {
  structuredNextApiHandler,
} from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { User } from "@prisma/client";
import withSessionApiRoute from "@/libs/server/session";

const handler: structuredNextApiHandler = async (req, res) => {
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
  if (!user) {
    return res.status(404).json({
      ok: false,
      error: "해당 Email/전화번호의 회원이 존재하지 않습니다",
    });
  }
  req.session.user = { id: user.id } as User;
  await req.session.save();

  return res.status(202).json({ ok: true, data: "비밀번호를 입력해주세요." });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["POST"], handler, isPrivate: false })
);
