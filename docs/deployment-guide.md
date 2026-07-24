# Panduan Backup dan Deployment ke Firebase App Hosting

Dokumen ini berisi panduan langkah demi langkah untuk mencadangkan (backup) proyek Anda ke repositori GitHub dan melakukan deployment ke **Firebase App Hosting**, platform yang direkomendasikan untuk proyek ini.

---

## Bagian 1: Menyiapkan Repositori di GitHub (Wajib)

Menyimpan kode Anda di layanan seperti GitHub adalah langkah pertama dan paling penting sebelum melakukan deployment.

### Langkah 1: Buat Repositori Baru di GitHub
1.  Buka [GitHub](https://github.com/) dan login ke akun Anda.
2.  Klik tombol **"+"** di pojok kanan atas, lalu pilih **"New repository"**.
3.  Beri nama repositori Anda (misalnya, `taut-app`).
4.  Pilih **Private** untuk menjaga kerahasiaan kode Anda. Ini sangat disarankan.
5.  **Jangan** centang opsi "Add a README file", "Add .gitignore", atau "Choose a license", karena proyek kita sudah memiliki semuanya.
6.  Klik **"Create repository"**.

Biarkan halaman repositori baru ini terbuka. Anda akan membutuhkannya di bagian selanjutnya.

---

## Bagian 2: Hosting Proyek di Firebase App Hosting

Firebase App Hosting terintegrasi penuh dengan Firebase Studio dan merupakan cara termudah untuk membuat aplikasi Anda online. Proses ini akan secara otomatis menghubungkan kode dari editor ini ke repositori GitHub yang baru Anda buat.

### Langkah 1: Buka Firebase Console dan App Hosting
1.  Buka [Firebase Console](https://console.firebase.google.com/).
2.  Pilih proyek Firebase yang sedang Anda gunakan untuk aplikasi ini.
3.  Di menu navigasi sebelah kiri, klik **Build > App Hosting**.

### Langkah 2: Buat Backend Baru dan Hubungkan ke GitHub
1.  Di halaman App Hosting, klik tombol **"Create backend"**.
2.  Ikuti petunjuk untuk **menghubungkan akun GitHub Anda** dan berikan izin Firebase untuk mengakses repositori Anda.
3.  Pilih repositori GitHub yang baru saja Anda buat (`taut-app`) dari daftar.
4.  Biarkan **"Root directory"** tetap kosong (default).
5.  Pilih branch **`main`** sebagai **"Live branch"**.
6.  Klik **"Finish and deploy"**.

Firebase sekarang akan mengambil kode dari lingkungan Firebase Studio ini, mengirimkannya ke repositori GitHub Anda, dan memulai proses deployment pertama.

### Langkah 3: Konfigurasi Environment Variables (Paling Penting!)
Deployment pertama **mungkin akan gagal**, dan itu normal karena kita belum mengatur "rahasia" (kunci API dari file `.env.local`).

1.  Setelah deployment dimulai, Anda akan diarahkan ke halaman detail backend Anda. Buka tab **"Settings"**.
2.  Gulir ke bawah hingga menemukan bagian **"Secrets"**. Di sinilah kita akan menambahkan variabel dari file `.env.local` Anda.
3.  Klik **"Add secret"**.
4.  Untuk setiap baris di file `.env.local`, Anda perlu membuat Secret baru:
    -   **Secret name**: Salin nama variabel (misal: `NEXT_PUBLIC_FIREBASE_API_KEY`).
    -   **Secret value**: Salin nilai variabel (misal: `AIza...`).
5.  Ulangi proses ini untuk **SEMUA variabel** yang ada di dalam file `.env.local` Anda.

**Penting:** Pastikan nama Secret cocok persis dengan nama variabel di file `.env.local`.

### Langkah 4: Picu Deployment Ulang
1.  Setelah semua secret ditambahkan, Anda perlu memicu deployment ulang agar perubahan ini diterapkan.
2.  Cara termudah adalah dengan meminta saya melakukan perubahan kecil pada kode (misalnya, menambahkan spasi di file `README.md`). Setiap perubahan yang saya terapkan akan secara otomatis memicu build dan deployment baru.
3.  Kembali ke tab **"Builds"** di App Hosting. Anda akan melihat deployment baru sedang berjalan. Kali ini, prosesnya akan berhasil.

Selamat! Aplikasi Anda sekarang sudah online dan berjalan di Firebase App Hosting. Setiap kali saya membuat perubahan pada kode, Firebase akan secara otomatis melakukan deployment ulang dengan versi terbaru.
