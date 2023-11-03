import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = (req, res) => {};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["GET", "POST"], handler })
);
