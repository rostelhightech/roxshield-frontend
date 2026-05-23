import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const protectedPaths = ["/dashboard", "/employee", "/admin"];
const publicPaths = ["/", "/login", "/pricing", "/about", "/demo", "/contact", "/legal"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Check if the path is protected
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users from login page to dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|opengraph-image|sitemap.xml|robots.txt).*)",
  ],
};
