import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "admin@ruangkita.com";
const ADMIN_PASSWORD_HASH =
  "$2a$10$1KNIJOUxRKAtwHiHSEjHXuKNE8ZS4LnN5FjJAGxabQzpgrOZU6Wfe";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Await cookies() di Next.js 15+
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "logged_in", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
