import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "admin@ruangkita.com";

// Hash stabil untuk password "admin123"
const ADMIN_PASSWORD_HASH =
  "$2b$10$BzQE.PPAz68wl8JFqg5jnuEDyFsIUmbNTprkcamTgG3TkhXujSvZG";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log("EMAIL MASUK:", email);
  console.log("PASSWORD MASUK:", password);
  console.log(
    "HASH COCOK?:",
    await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  );

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

  cookies().set("admin_session", "logged_in", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 hari
  });

  return NextResponse.json({ success: true });
}
