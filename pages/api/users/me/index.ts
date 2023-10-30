import { structuredNextApiHandler } from "@/libs/server/request-validator";
import withSessionApiRoute from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";
import { Prisma } from "@prisma/client";
import { fail } from "assert";
import { HTTPMESSAGE } from "@/constants/apiroutes";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    session: { user },
    method,
  } = req;
  if (!user) {
    return res.status(404).json({ ok: false, error: "먼저 로그인 해 주세요" });
  }
  switch (method) {
    case "GET": {
      const profile = await client.user.findUnique({
        where: { id: user.id },
      });
      if (!profile) {
        return res
          .status(500)
          .json({ ok: false, error: "유저 정보를 찾을 수 없습니다." });
      }
      return res.status(202).json({ ok: true, data: profile });
    }
    case "POST": {
      const { email, phone, introduction, password, imagePath } = req.body;
      const userData = await client.user.login({
        password,
        id: +user.id.toString(),
      });
      if (!userData) {
        return res
          .status(404)
          .json({ ok: false, error: "비밀번호가 올바르지 않습니다." });
      }

      if (email !== userData.email || phone !== userData.phone) {
        const exist = await client.user.findMany({
          where: {
            NOT: {
              id: userData.id,
            },
            OR: [
              {
                email: email,
              },
              {
                phone: phone,
              },
            ],
          },
        });
        if (exist.length) {
          res
            .status(404)
            .json({ ok: false, error: `이미 존재하는 email/phone입니다` });
        }
      }

      const update = await client.user.update({
        where: { id: userData.id },
        data: {
          email: email,
          phone: phone,
          introduction: introduction,
          activityLogs: {
            create: [
              {
                type: "EditProfile",
              },
            ],
          },
        },
      });
      if (!update) {
        return res
          .status(500)
          .json({ ok: false, error: HTTPMESSAGE.STATUS500 });
      }
      return res.status(202).json({ ok: true, data: update });
    }
  }
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["GET", "POST"], handler })
);
