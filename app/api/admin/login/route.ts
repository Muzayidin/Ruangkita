import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Import Prisma Client
import * as bcrypt from "bcryptjs"; // Import bcryptjs

const prisma = new PrismaClient(); // Inisialisasi Prisma

interface LoginRequestBody {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const { username, password }: LoginRequestBody = await request.json();

  try {
    // 1. Cari pengguna (admin) berdasarkan username
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        username: username,
      },
    });

    // Jika pengguna tidak ditemukan
    if (!adminUser) {
      return NextResponse.json(
        { message: "Username atau password tidak valid." },
        { status: 401 }
      );
    }

    // 2. Verifikasi password dengan hash yang tersimpan di database
    // Membandingkan password yang dimasukkan dengan adminUser.password (hash)
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Username atau password tidak valid." },
        { status: 401 }
      );
    }

    // 3. Autentikasi Berhasil

    // TODO: GANTI DENGAN PEMBUATAN TOKEN JWT ASLI UNTUK KEAMANAN NYATA
    const token = "valid-jwt-token-for-admin-id-" + adminUser.id;

    const response = NextResponse.json({
      message: "Login berhasil!",
      user: { id: adminUser.id, username: adminUser.username },
    });

    // Setel HTTP-Only Cookie
    response.cookies.set("admin_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 jam
      path: "/", // ⬅️ penting: supaya kebaca di /api/... juga
    });

    return response;
  } catch (error) {
    console.error("Database or Server Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}
