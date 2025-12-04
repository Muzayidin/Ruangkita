import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminAuthToken = request.cookies.get("admin_auth_token");
  const pathname = request.nextUrl.pathname;

  // 1. Lindungi rute admin
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!adminAuthToken) {
      // Redirect ke halaman login
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // 2. Jika sudah login, jangan biarkan mengakses halaman login
  if (pathname === "/admin/login" && adminAuthToken) {
    // Redirect ke dashboard admin
    const url = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Tentukan rute mana yang akan dijalankan oleh middleware
export const config = {
  matcher: ["/admin/:path*"],
};
