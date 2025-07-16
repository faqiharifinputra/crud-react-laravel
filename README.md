# CRUD React + Laravel

Aplikasi CRUD (Create, Read, Update, Delete) menggunakan Laravel (backend API) dan React.js (frontend).  
Fitur yang tersedia:

✅ Tambah, edit, hapus item  
✅ Sorting dan pencarian item  
✅ Status item (Published / Pending)  
✅ Keranjang belanja  
✅ Beli Sekarang dengan popup  
✅ Export data ke PDF / Excel (opsional)

## 📦 Instalasi

```bash
# Jalankan Laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Jalankan React
npm install
npm run dev
