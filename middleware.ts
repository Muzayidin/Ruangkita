import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  const path = req.nextUrl.pathname;

  const isAdminPage = path.startsWith("/admin");
  const isLoginPage = path === "/admin/login";

  // Jika sudah login dan akses halaman login, redirect ke dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin/products", req.url));
  }

  // Jika belum login dan akses halaman admin (bukan login), redirect ke login
  if (isAdminPage && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
