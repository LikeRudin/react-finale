import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).json({
      ok: false,
      error: HTTPMESSAGE.STATUS404("적절한 userId를 입력해주세요"),
    });
  }
  const profile = await client.user.getOtherProfile(+id.toString());
  if (!profile) {
    return res.status(404).json({
      ok: false,
      error: HTTPMESSAGE.STATUS404("존재하지 않는 user입니다."),
    });
  }
  return res.status(200).json({ ok: true, data: profile });
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["GET"], handler })
);
