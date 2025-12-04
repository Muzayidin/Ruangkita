import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Muat variabel lingkungan dari .env
dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

// Kredensial Admin yang Ingin Dibuat
const ADMIN_USERNAME = "superadmin";
const ADMIN_PASSWORD = "verysecurepassword"; // GANTI DENGAN PASSWORD ASLI ANDA

async function main() {
  console.log("Memulai proses seeding admin user...");

  try {
    // 1. Hashing Password
    console.log(`Meng-hash password untuk user: ${ADMIN_USERNAME}...`);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10); // 10 adalah salt rounds

    // 2. Memeriksa apakah user sudah ada
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { username: ADMIN_USERNAME },
    });

    if (existingAdmin) {
      console.log(
        `Admin user '${ADMIN_USERNAME}' sudah ada. Melewatkan pembuatan.`
      );
      // Opsional: Anda bisa memperbarui password di sini jika diperlukan
      return;
    }

    // 3. Membuat Admin User Baru
    const newAdmin = await prisma.adminUser.create({
      data: {
        username: ADMIN_USERNAME,
        password: hashedPassword,
      },
    });

    console.log("✅ Admin user berhasil dibuat!");
    console.log(`Username: ${newAdmin.username}`);
    // Jangan pernah log password hash di production
    console.log(`ID: ${newAdmin.id}`);
  } catch (e) {
    console.error("Terjadi kesalahan saat membuat admin user:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
