import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ROUTE_PATH } from "./libs/util/apiroutes";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const path = new URL(req.url, process.env.BASE_URL).pathname;

  if (!req.cookies.getAll().length && !path.includes("enter")) {
    return NextResponse.redirect(new URL(ROUTE_PATH.ENTER, req.url));
  }

  return res;
};

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
