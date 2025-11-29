import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "admin@ruangkita.com";
const ADMIN_PASSWORD_HASH =
<<<<<<< HEAD
  "$2a$10$1KNIJOUxRKAtwHiHSEjHXuKNE8ZS4LnN5FjJAGxabQzpgrOZU6Wfe";
=======
  "$2b$10$IExi4Dg3qmUqL1PyK1Pxz.WHfMdnz.X/OTv4UG9O.84s93uL/IIj."; // password: admin123
>>>>>>> 8c9bcd5daa217d295d9efb4e4595dfade1bd04b3

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

<<<<<<< HEAD
    // Validasi input
=======
>>>>>>> 8c9bcd5daa217d295d9efb4e4595dfade1bd04b3
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
<<<<<<< HEAD
=======
    console.log("Password diterima server:", JSON.stringify(password));
    console.log("Panjang password:", password.length);
>>>>>>> 8c9bcd5daa217d295d9efb4e4595dfade1bd04b3

    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

<<<<<<< HEAD
    // Await cookies() di Next.js 15+
=======
>>>>>>> 8c9bcd5daa217d295d9efb4e4595dfade1bd04b3
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
