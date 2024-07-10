// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/" || path === "/search";
  const isAuthPath = path.startsWith("/auth");
  const isApiPath = path.startsWith("/api");
  const token = request.cookies.get("token")?.value;

  if (isAuthPath && token) {
    try {
      // If the token is valid, redirect to dashboard
      await verifyToken(token);
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // If the token is invalid, allow access to auth page
      return NextResponse.next();
    }
  }

  if (!isPublicPath && !isApiPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
