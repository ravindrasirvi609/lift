import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthPath = path === "/auth";
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

  // For all other routes, no redirection is needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
