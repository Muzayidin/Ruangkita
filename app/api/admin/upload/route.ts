import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs";
import path from "path";

async function requireAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_auth_token");
    return !!token;
}

export async function POST(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const imageFile = formData.get("file") as File | null;

        if (!imageFile || imageFile.size === 0) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const mime = imageFile.type || "image/jpeg";
        const ext = mime.split("/")[1] || "jpg";
        const filename = `${crypto.randomUUID()}.${ext}`;

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filepath, buffer);

        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: fileUrl });
    } catch (err) {
        console.error("Upload error:", err);
        return new NextResponse("Failed to upload image", { status: 500 });
    }
}
