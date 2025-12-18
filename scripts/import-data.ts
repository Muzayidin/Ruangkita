import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const dataPath = path.join(process.cwd(), 'migration_data.json');

async function main() {
    if (!fs.existsSync(dataPath)) {
        console.error("Migration data file not found: migration_data.json");
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log("Starting import...");

    // 1. Import Products
    if (data.products && data.products.length > 0) {
        console.log(`Importing ${data.products.length} products...`);
        for (const p of data.products) {
            try {
                await prisma.products.upsert({
                    where: { slug: p.slug },
                    update: {
                        name: p.name,
                        price: p.price,
                        category: p.category,
                        description: p.description,
                        imageUrl: p.imageUrl,
                        stock: p.stock,
                        featured: p.featured,
                        soldCount: p.soldCount,
                        originalPrice: p.originalPrice
                    },
                    create: {
                        id: p.id ? p.id.toString() : undefined,
                        slug: p.slug,
                        name: p.name,
                        price: p.price,
                        category: p.category,
                        description: p.description,
                        imageUrl: p.imageUrl,
                        stock: p.stock,
                        featured: p.featured,
                        soldCount: p.soldCount,
                        originalPrice: p.originalPrice
                    }
                });
            } catch (error) {
                console.error(`Failed to import product ${p.slug}:`, (error as Error).message);
            }
        }
    }

    // 2. Import Articles
    if (data.articles && data.articles.length > 0) {
        console.log(`Importing ${data.articles.length} articles...`);
        for (const a of data.articles) {
            try {
                // Adjusting to actual schema: id, slug, title, content, imageUrl, published
                // Missing in schema but in source: excerpt, author, category, published_date
                // We will map image_url -> imageUrl if needed
                await prisma.article.upsert({
                    where: { slug: a.slug }, // Use slug as unique identifier
                    update: {
                        title: a.title,
                        content: a.content,
                        imageUrl: a.image_url || a.imageUrl,
                    },
                    create: {
                        // id: a.id, // Let autoincrement handle it to avoid conflicts if IDs changed
                        slug: a.slug,
                        title: a.title,
                        content: a.content,
                        imageUrl: a.image_url || a.imageUrl,
                        published: true // Default to true
                    }
                });
            } catch (error) {
                console.error(`Failed to import article ${a.slug}:`, (error as Error).message);
            }
        }
    }

    // 3. Import Users
    if (data.users && data.users.length > 0) {
        console.log(`Importing ${data.users.length} users...`);
        for (const u of data.users) {
            try {
                // Adjusting to actual schema: id, username, password
                // Removed: createdAt, updatedAt (not in schema)
                await prisma.adminUser.upsert({
                    where: { username: u.username },
                    update: {
                        password: u.password,
                    },
                    create: {
                        username: u.username,
                        password: u.password,
                    }
                });
            } catch (error) {
                console.error(`Failed to import user ${u.username}:`, (error as Error).message);
            }
        }
    }

    console.log("Import completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
