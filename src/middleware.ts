import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthPath = path === "/auth";
  const isPublicPath =
    path === "/" ||
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.startsWith("/verifyemail") ||
    path.startsWith("/privacy") ||
    path.startsWith("/terms") ||
    path.startsWith("/cookies") ||
    path.startsWith("/about") ||
    path.startsWith("/contact") ||
    path.startsWith("/public");

  const token = request.cookies.get("token")?.value;

  if (isAuthPath) {
    if (token) {
      try {
        // If the token is valid, redirect to home
        await verifyToken(token);
        return NextResponse.redirect(new URL("/", request.url));
      } catch (error) {
        // If the token is invalid, allow access to auth page
        return NextResponse.next();
      }
    }
    // If no token, allow access to auth page
    return NextResponse.next();
  }

  // For public paths, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For all other routes (private routes), check for valid token
  if (!token) {
    // If no token, redirect to auth page
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    // Verify token
    await verifyToken(token);
    // If token is valid, allow access
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to auth page
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
