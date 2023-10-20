import { NextApiHandler } from "next";

type HTTPMethod = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

interface ApiRequestOptions {
  methods: HTTPMethod[];
  handler: NextApiHandler;
  isPrivate: boolean;
}

type ResponseType = { ok: true; data: any } | { ok: false; error: any };

export type structuredNextApiHandler = NextApiHandler<ResponseType>;

type ApiRequestValidator = (
  optionObject: ApiRequestOptions
) => structuredNextApiHandler;

const validateAndHandleRequest: ApiRequestValidator = ({
  methods,
  isPrivate = true,
  handler,
}) => {
  return async function (req, res) {
    if (req.method && !methods.includes(req.method as HTTPMethod)) {
      return res
        .status(405)
        .json({ ok: false, error: "정의되지않은 HTTP Request 입니다." });
    }
    if (isPrivate && !req.session.user) {
      return res
        .status(404)
        .json({ ok: false, error: "로그인한 사용자만 보낼수있는 요청입니다." });
    }
    try {
      await handler(req, res);
    } catch (error) {
      return res.status(500).json({ ok: false, error: error });
    }
  };
};

export default validateAndHandleRequest;
