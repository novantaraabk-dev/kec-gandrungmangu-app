# Panduan Deployment ke Vercel dari Firebase Studio

Dokumen ini berisi panduan langkah demi langkah untuk mencadangkan (backup) proyek Anda ke repositori GitHub dan melakukan deployment ke **Vercel**.

Karena lingkungan Firebase Studio tidak memiliki terminal untuk menjalankan perintah `git` secara manual, kita akan menggunakan alur kerja unik untuk memindahkan kode ke GitHub terlebih dahulu.

---

## Bagian 1: Memindahkan Kode ke Repositori GitHub

Cara termudah untuk memindahkan kode dari Firebase Studio ke repositori GitHub adalah dengan "meminjam" proses penyiapan dari **Firebase App Hosting**, bahkan jika tujuan akhir kita adalah Vercel. Proses ini akan menangani pembuatan repositori dan pengiriman kode awal secara otomatis.

### Langkah 1: Buat Repositori Baru di GitHub
1.  Buka [GitHub](https://github.com/) dan login ke akun Anda.
2.  Klik tombol **"+"** di pojok kanan atas, lalu pilih **"New repository"**.
3.  Beri nama repositori Anda (misalnya, `taut-app`).
4.  Pilih **Private** untuk menjaga kerahasiaan kode Anda. Ini sangat disarankan.
5.  **PENTING: Jangan** centang opsi "Add a README file", "Add .gitignore", atau "Choose a license", karena proyek kita sudah memiliki semuanya.
6.  Klik **"Create repository"**. Biarkan halaman ini terbuka.

### Langkah 2: Hubungkan Firebase Studio ke GitHub
1.  Buka [Firebase Console](https://console.firebase.google.com/).
2.  Pilih proyek Firebase yang sedang Anda gunakan untuk aplikasi ini.
3.  Di menu navigasi sebelah kiri, klik **Build > App Hosting**.
4.  Di halaman App Hosting, klik tombol **"Create backend"**.
5.  Ikuti petunjuk untuk **menghubungkan akun GitHub Anda**.
6.  Saat diminta memilih repositori, pilih repositori yang baru saja Anda buat (`taut-app`).
7.  Biarkan **"Root directory"** tetap kosong.
8.  Pilih branch **`main`** sebagai **"Live branch"**.
9.  Klik **"Finish and deploy"**.

Firebase sekarang akan mengambil semua kode dari editor ini dan mengirimkannya ke repositori GitHub Anda. **Deployment pertama di Firebase App Hosting mungkin akan gagal**, dan itu tidak masalah karena kita hanya membutuhkan kodenya untuk berada di GitHub.

Setelah proses ini selesai, kode Anda sudah aman di GitHub dan siap untuk langkah selanjutnya.

---

## Bagian 2: Hosting Proyek di Vercel

Sekarang setelah kode ada di GitHub, kita bisa dengan mudah men-deploy-nya ke Vercel.

### Langkah 1: Impor Proyek ke Vercel
1.  Buka [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2.  Klik **"Add New..."** dan pilih **"Project"**.
3.  Temukan repositori GitHub Anda (`taut-app`), lalu klik **"Import"**.
4.  Vercel akan otomatis mendeteksi bahwa ini adalah proyek Next.js. Pengaturan default yang ditampilkan biasanya sudah benar.

### Langkah 2: Konfigurasi Environment Variables (Paling Penting!)
Deployment **akan gagal** jika Anda tidak mengatur kunci API Firebase Anda.

1.  Sebelum menekan tombol "Deploy", buka bagian **"Environment Variables"**.
2.  Anda perlu menyalin setiap baris dari file `.env.local` di proyek Anda dan menambahkannya sebagai *Environment Variable* di Vercel.

    Untuk setiap baris di `.env.local` (misal: `NEXT_PUBLIC_FIREBASE_API_KEY=AIza...`):
    -   **Name**: Salin nama variabel (misal: `NEXT_PUBLIC_FIREBASE_API_KEY`).
    -   **Value**: Salin nilai variabel (misal: `AIza...`).
    -   Klik **"Add"**.

3.  Ulangi proses ini untuk **SEMUA variabel** yang ada di dalam file `.env.local` Anda. Pastikan nama variabelnya sama persis.

### Langkah 3: Deploy
1.  Setelah semua Environment Variables ditambahkan, klik tombol **"Deploy"**.
2.  Vercel akan memulai proses build dan deployment.
3.  Setelah selesai, Vercel akan memberikan URL publik untuk aplikasi Anda.

Selamat! Aplikasi Anda sekarang sudah online. Setiap kali ada perubahan baru di Firebase Studio, kode akan otomatis terkirim ke GitHub, dan Vercel akan melakukan deployment ulang.
