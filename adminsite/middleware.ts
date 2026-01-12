import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
export async function middleware(request: NextRequest) {
  // Public routes
  if (request.nextUrl.pathname.match(/^\/(login|logout)?$/)) {
    return NextResponse.next(); 
  }

  // Check localStorage token (client sends via header)
  const token =
    request.headers.get("x-auth-token") ||
    request.cookies.get("adminToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // ✅ Use YOUR JWT_SECRET from .env
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, secret) as { id: number; email: string };

    // Add user to request headers
    const response = NextResponse.next();
    response.headers.set("x-admin-id", decoded.id.toString());
    return response;
  } catch (error) {
    console.error("Middleware JWT error:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("adminToken");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
