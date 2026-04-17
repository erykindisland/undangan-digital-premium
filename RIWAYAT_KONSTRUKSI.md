# Riwayat Konstruksi: Undangan Digital Premium

Dokumen ini mencatat perjalanan pengembangan proyek ini dari awal hingga peluncuran di Cloudflare.

## 📅 Kronologi Pengembangan

### Fase 1: Dasar & Arsitektur
- **Analisis Awal**: Merancang sistem undangan dinamis yang berbasis pada parameter URL (`?to=slug`).
- **Backend GAS**: Membangun Google Apps Script untuk menyimpan data RSVP ke Google Sheets.
- **Isolasi Database**: Mengimplementasikan sistem "Isolated Tab" di mana setiap pengantin memiliki tab database RSVP sendiri agar data tidak tercampur.

### Fase 2: Fitur Admin & Keamanan
- **Dashboard Admin**: Membuat dashboard khusus (`?admin=true`) untuk menyetujui (approve) pesanan customer sebelum database mereka aktif.
- **Robust URL Parsing**: Memperbaiki logika pembacaan URL agar tahan terhadap karakter-karakter ter-encode (seperti `%3D` dan `%26`) saat link dibagikan lewat chat.

### Fase 3: Variasi Desain (Themes)
- **Tema Standar (Sage)**: Desain pertama dengan nuansa alam yang elegan.
- **Tema Gold**: Desain mewah dengan aksen emas dan latar belakang gelap.
- **Tema Royal Crystal**: Desain ultra-premium menggunakan teknik *Glassmorphism* dan animasi modern.

### Fase 4: Cloud & Portabilitas
- **GitHub & Cloudflare**: Menghubungkan folder lokal ke repositori GitHub `erykindisland/undangan-digital-premium` dan mengaktifkan hosting di Cloudflare Pages.
- **Dokumentasi & Backup**: Menyiapkan file panduan ini agar proyek bisa dilanjutkan di komputer lain dengan sinkronisasi cloud.

---

## 💡 Keputusan Teknis Penting
- **No Database Server**: Proyek ini sengaja tidak menggunakan database SQL yang mahal, melainkan memanfaatkan Google Sheets sebagai database yang gratis, mudah diedit, dan *real-time*.
- **Static Frontend**: Menggunakan Cloudflare Pages untuk memastikan website terbuka sangat cepat di seluruh dunia.
- **Single File Logic**: Semua logika mode (Public, Editor, Admin) berada dalam satu file `index.html` (per tema) untuk memudahkan pemeliharaan.

---
*Dokumen ini merupakan ringkasan perjalanan kolaborasi antara User & Antigravity AI.*
