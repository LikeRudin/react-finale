import validateAndHandleRequest, {
  structuredNextApiHandler,
} from "@/libs/server/request-validator";
import withSessionApiRoute from "@/libs/server/session";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = async (req, res) => {
  const { email, phone, username, password, passwordconfirm } = req.body;

  const userExist = await client.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });
  if (userExist) {
    return res
      .status(400)
      .json({ ok: false, error: "이미 가입된 이메일 또는 전화번호입니다." });
  }
  if (password !== passwordconfirm) {
    return res.status(404).json({
      ok: false,
      error: `비밀번호/비밀번호확인 값이 다릅니다.${password} ${passwordconfirm}`,
    });
  }

  const user = await client.user.createUser({
    email,
    phone,
    username,
    password,
  });

  if (!user) {
    res.status(500).json({
      ok: false,
      error: "알수없는 서버오류로 회원가입에 실패했습니다.",
    });
  }

  req.session.user = user;
  await req.session.save();

  return res.status(202).json({ ok: true, data: "회원가입 성공" });
};

export default withSessionApiRoute(
  validateAndHandleRequest({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
