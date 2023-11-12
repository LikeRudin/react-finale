import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import type { structuredNextApiHandler } from "@/libs/server/request-validator";
import { HTTPMESSAGE } from "@/libs/util/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ACCOUNT_ID}/images/v1/direct_upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUD_FLARE_IMAGES_TOKEN}`,
        },
      }
    )
  ).json();
  if (!response) {
    return res.status(500).json({
      ok: false,
      error: HTTPMESSAGE.STATUS500("Cloud Flare와의 통신에 실패했습니다."),
    });
  }
  return res.json({
    ok: true,
    ...response.result,
  });
};
export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["GET"], handler })
);
