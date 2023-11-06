import type { GetServerSideProps, NextApiHandler } from "next";

import type { User } from "@prisma/client";

import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: process.env.COOKIE_NAME as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 3600000),
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export const withSessionApiRoute = (handler: NextApiHandler) =>
  withIronSessionApiRoute(handler, sessionOptions);

export const withSessionSSR = (handler: GetServerSideProps) =>
  withIronSessionSsr(handler, sessionOptions);
