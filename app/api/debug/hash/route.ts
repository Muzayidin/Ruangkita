import bcrypt from "bcryptjs";

export async function GET() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);

  return new Response(hash);
}
