# Dokumentasi Sistem: Undangan Digital Premium

Dokumen ini merangkum arsitektur, link, dan logika sistem untuk operasional harian.

## 🔗 Link Akses Utama
Berikut adalah link resmi yang sudah online melalui Cloudflare:

- **Dashboard Admin (Pusat Kendali)**:
  `https://undangan-digital-premium.erykind-island.workers.dev/?admin=true`
- **Tampilan Utama (Sage Green)**:
  `https://undangan-digital-premium.erykind-island.workers.dev/?to=budi-ani-wedding`
- **Tampilan Gold Luxe**:
  `https://undangan-digital-premium.erykind-island.workers.dev/index_gold.html?to=budi-ani-wedding`
- **Tampilan Royal Crystal (WOW)**:
  `https://undangan-digital-premium.erykind-island.workers.dev/index_crystal.html?to=budi-ani-wedding`

---

## 🛠️ Arsitektur Backend (Google Apps Script)
Sistem ini menggunakan Google Apps Script sebagai jembatan antara Frontend (Website) dan Database (Google Sheets).

### 1. Logika Multi-Tenant (Isolasi Data)
- Setiap customer (Slug) memiliki **Tab Sheet** sendiri di Google Sheets.
- Data RSVP tamu tidak akan pernah tercampur antar customer.
- Tab Sheet baru akan dibuat otomatis saat Anda melakukan **Approve** di Dashboard Admin.

### 2. Status Approval
- **Status: PENDING**: Undangan baru yang di-input lewat Editor tidak akan bisa dilihat publik sampai Anda menyetujuinya di Admin.
- **Status: APPROVED**: Folder/Tab database dibuat, dan tamu bisa mulai mengisi RSVP.

---

## 📦 Komponen Proyek di GitHub
Repositori: `https://github.com/erykindisland/undangan-digital-premium`

1. `index.html`: Kode sumber tema standar.
2. `index_gold.html`: Kode sumber tema mewah.
3. `index_crystal.html`: Kode sumber tema ultra-premium.
4. `code.gs`: Salinan kode backend (untuk backup).

---

## 🔒 Keamanan
- Dashboard Admin hanya terbuka jika parameter `?admin=true` dimasukkan.
- Pastikan Anda merahasiakan link admin tersebut.

*Dokumentasi ini dibuat otomatis oleh Antigravity AI.*
