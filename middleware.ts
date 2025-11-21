import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  const path = req.nextUrl.pathname;

  const isAdminPage = path.startsWith("/admin");
  const isLoginPage = path === "/admin/login";

  // Jika membuka /admin tetapi belum login → redirect ke login
  if (isAdminPage && !session && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Jika sudah login tapi membuka /admin/login → redirect ke dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin/products", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
