import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const isPublicPath =
    path === "/" || path === "/search" || path.startsWith("/auth");

  // Check for authentication token
  const token = request.cookies.get("authToken")?.value;

  // Redirect logic
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
