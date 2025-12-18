# Panduan Deploy ke aaPanel (Node.js)

Berikut adalah langkah-langkah untuk men-deploy aplikasi Next.js ini ke server yang menggunakan aaPanel.

## Prasyarat di aaPanel
1.  **Install Node.js Version Manager**:
    *   Buka App Store di aaPanel.
    *   Cari "Node.js version manager" dan install.
    *   Setelah terinstall, buka setting-nya dan install **Node.js v18** atau **v20** (Recommended).
2.  **Install PostgreSQL** (Jika database juga di server yang sama):
    *   Cari "PostgreSQL Manager" di App Store aaPanel dan install.
    *   Buat database dan user baru. Catat `username`, `password`, dan `nama database`.

## Langkah Deploy

### 1. Upload File
Anda bisa meng-upload file project Anda ke server. Ada dua cara:
*   **Cara A (Git Clone - Disarankan)**:
    1.  Masuk ke folder website (misal `/www/wwwroot/domainanda.com`).
    2.  Buka terminal di aaPanel.
    3.  Jalankan `git clone <repository_url> .`
*   **Cara B (Upload Manual)**:
    1.  Compress folder project di komputer Anda (kecuali `node_modules`, `.next`, dan `.git`).
    2.  Upload zip tersebut ke File Manager aaPanel di folder website yang diinginkan.
    3.  Ekstrak file zip tersebut.

### 2. Setup Database & Env
1.  Di File Manager aaPanel, buat file baru bernama `.env`.
2.  Isi dengan konfigurasi Production Anda:
    ```env
    DATABASE_URL="postgresql://user_db:password_db@localhost:5432/nama_db"
    NODE_ENV="production"
    ```
    *(Sesuaikan user, password, dan nama db dengan yang Anda buat di PostgreSQL Manager aaPanel).*

### 3. Install & Build via Terminal aaPanel
Buka terminal di aaPanel dan arahkan ke folder project Anda, lalu jalankan:

```bash
# 1. Install Dependencies
npm install

# 2. Setup Database Schema (Penting!)
npx prisma generate
npx prisma db push  # Atau 'npx prisma migrate deploy' jika menggunakan migration

# 3. Build Aplikasi Next.js
npm run build
```

Jika build sukses, Anda siap menjalankannya.

### 4. Menjalankan Website (Node.js Project)
1.  Buka **Website** -> **Node.js Project** (tab).
2.  Klik **Add Node.js Project**.
3.  Isi form:
    *   **Project Path**: Pilih folder tempat Anda upload file tadi.
    *   **Name**: Nama bebas (misal: `ruangkita-web`).
    *   **Start Script**: Pilih `custom command` -> ketik `npm start` ATAU pilih file -> script: `start`.
    *   **Port**: `3000` (Default Next.js).
    *   **Node Version**: Pilih v18/v20.
    *   **Domain**: Masukkan domain website Anda (misal: `ruangkita.com`).
4.  Klik **Submit**.

### 5. Selesai!
aaPanel akan otomatis menjalankan aplikasi Anda menggunakan PM2 dan mengatur Nginx reverse proxy agar domain Anda mengarah ke port 3000.

## Troubleshooting Umum
*   **Error 502 Bad Gateway**: Aplikasi belum berjalan atau port salah. Cek log di Node.js Project -> Log.
*   **Database Error**: Pastikan connection string di `.env` benar dan PostgreSQL service berjalan.
*   **Permission Denied**: Pastikan user `www` memiliki akses ke folder project (`Chown` ke `www` di File Manager).
