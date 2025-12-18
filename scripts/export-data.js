const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/datas.db');
const outputPath = path.join(__dirname, '../migration_data.json');

console.log(`Reading database from: ${dbPath}`);

if (!fs.existsSync(dbPath)) {
    console.error("Database file not found!");
    process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

try {
    // 1. Export Products
    const products = db.prepare("SELECT * FROM products").all();
    console.log(`Found ${products.length} products.`);

    // 2. Export Articles
    // Cek apakah tabel Article ada (kadang case sensitive atau nama beda)
    let articles = [];
    try {
        articles = db.prepare("SELECT * FROM Article").all();
        console.log(`Found ${articles.length} articles.`);
    } catch (e) {
        console.warn("Could not read Article table (might be empty or named differently):", e.message);
    }

    // 3. Export AdminUsers
    let users = [];
    try {
        users = db.prepare("SELECT * FROM AdminUser").all();
        console.log(`Found ${users.length} users.`);
    } catch (e) {
        console.warn("Could not read AdminUser table:", e.message);
    }

    const data = {
        products,
        articles,
        users
    };

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Successfully exported data to ${outputPath}`);

} catch (error) {
    console.error("Error exporting data:", error);
} finally {
    db.close();
}
