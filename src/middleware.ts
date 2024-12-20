import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const LoginRegisterRoutes = ["/login", "/register"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoggedIn = !!token;

  const { pathname } = req.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (LoginRegisterRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/members", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
