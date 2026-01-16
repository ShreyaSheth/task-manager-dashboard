import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtUtils } from "./lib/jwt";

// Define protected routes
const protectedRoutes = ["/dashboard", "/projects", "/tasks"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // No token - redirect to login for protected routes, allow others
  if (!token) {
    if (isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Has token - verify it
  const payload = await jwtUtils.verify(token);

  // Invalid token - clear it and handle appropriately
  if (!payload) {
    const response = isProtectedRoute
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();

    // Always clear invalid tokens
    response.cookies.delete("token");
    return response;
  }

  // Valid token - redirect away from auth pages
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
