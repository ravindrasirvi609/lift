import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/" || path === "/search" || path.startsWith("/auth");
  const token = request.cookies.get("token")?.value;

  // For non-public paths, redirect to auth if no token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // For public paths (including home), don't redirect regardless of token
  if (isPublicPath) {
    // If there's a token, verify it
    if (token) {
      try {
        await verifyToken(token);
        // Token is valid, continue to the page
        return NextResponse.next();
      } catch (error) {
        // If token is invalid, remove it
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    // No token on public path, just continue
    return NextResponse.next();
  }

  // For all other cases, continue to the page
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
