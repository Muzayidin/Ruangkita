import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const username = "adminkita";
    const password = "ruangkita123";

    console.log(`Resetting admin user: ${username}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update existing user or create new one
    const user = await prisma.adminUser.upsert({
        where: { username: username },
        update: {
            password: hashedPassword,
        },
        create: {
            username: username,
            password: hashedPassword,
        },
    });

    console.log(`Success! Admin user '${user.username}' is ready.`);
    console.log(`Password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
