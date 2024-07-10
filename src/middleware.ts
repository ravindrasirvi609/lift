// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/" || path === "/search" || path.startsWith("/auth");
  const isApiPath = path.startsWith("/api");
  const token = request.cookies.get("token")?.value;

  if (!isPublicPath && !isApiPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
