# Mini-LMS (Learning Management System)

Sebuah aplikasi web Learning Management System (LMS) sederhana yang dibuat sebagai *Capstone Project* untuk program **HACKTIV8 & IBM "Code Generations and Optimization"**. Aplikasi ini memungkinkan pengguna untuk mendaftar, login, melihat daftar kursus, dan melacak progres belajar mereka.

Proyek ini dibangun sebagai *Single Page Application* (SPA) menggunakan React.js dan memanfaatkan Firebase sebagai Backend-as-a-Service (BaaS) untuk otentikasi dan database.

---

### Identitas Pengembang

- **Nama:** Evan Fulka Bima Maheswara
- **NIM:** 2210512079
- **Program Studi:** S1 Sistem Informasi
- **Universitas:** Universitas Pembangunan Nasional "Veteran" Jakarta

---

## Fitur Utama

- **Otentikasi Pengguna:** Sistem registrasi, login, dan logout yang aman menggunakan Firebase Authentication.
- **Dashboard Kursus:** Menampilkan seluruh daftar kursus yang tersedia secara dinamis dari database Cloud Firestore.
- **Detail Kursus & Pelajaran:** Pengguna dapat melihat daftar pelajaran untuk setiap kursus yang dipilih.
- **Halaman Konten Pelajaran:** Tampilan khusus untuk membaca materi dari setiap pelajaran.
- **Pelacakan Progres:** Pengguna dapat menandai pelajaran sebagai "selesai", dan progres ini akan disimpan secara spesifik untuk akun mereka.
- **Rekapitulasi Progres:** Halaman khusus "Progres Saya" yang menampilkan rekapitulasi kemajuan belajar di semua kursus, lengkap dengan *progress bar*.
- **UI Responsif & Interaktif:** Antarmuka yang bersih dibangun dengan Tailwind CSS dan dilengkapi notifikasi *toast* untuk memberikan *feedback* yang jelas kepada pengguna.

---

## Teknologi yang Digunakan

- **Frontend:**
  - **React.js:** Library JavaScript untuk membangun antarmuka pengguna berbasis komponen.
  - **Vite:** *Build tool* modern yang memberikan pengalaman development yang sangat cepat.
  - **Tailwind CSS:** Framework CSS *utility-first* untuk styling yang cepat dan konsisten.
- **Backend (BaaS):**
  - **Firebase Authentication:** Untuk menangani semua proses otentikasi pengguna.
  - **Cloud Firestore:** Database NoSQL *real-time* untuk menyimpan data kursus, pelajaran, dan progres pengguna.
- **Library Tambahan:**
  - **`react-hot-toast`:** Untuk menampilkan notifikasi *pop-up* yang bersih dan informatif.
- **Deployment:**
  - **Firebase Hosting:** Aplikasi ini telah di-*deploy* dan dapat diakses secara publik. **[Lihat Versi Live](https://mini-lms-capstone.web.app/)**

---

## Instruksi Setup Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Prasyarat:**
    Pastikan Anda sudah menginstal **Node.js** (v18 atau lebih baru) dan **npm** di komputer Anda.

2.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/URL-ANDA/NAMA-REPOSITORI-ANDA.git](https://github.com/URL-ANDA/NAMA-REPOSITORI-ANDA.git)
    cd nama-folder-proyek
    ```

3.  **Instal Dependensi:**
    ```bash
    npm install
    ```

4.  **Konfigurasi Firebase:**
    - Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
    - Aktifkan **Authentication** (dengan provider Email/Password) dan **Cloud Firestore** (dalam mode tes).
    - Dari pengaturan proyek Anda, dapatkan objek `firebaseConfig`.
    - Buat file baru di `src/firebase.js` dan salin kode berikut, lalu ganti dengan konfigurasi Anda:
    ```javascript
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    ```

5.  **Jalankan Aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

---

## Penjelasan Dukungan AI

Proyek ini dikembangkan dengan pendekatan *pair programming* menggunakan dua model AI utama, **Google Gemini** dan **IBM Granite**, untuk memaksimalkan efisiensi dan kualitas kode.

1.  **IBM Granite (Code Generation & Optimization):**
    -   IBM Granite digunakan untuk menghasilkan blok kode spesifik yang teroptimisasi. Contohnya termasuk pembuatan *query* kompleks ke Firestore (misalnya, `query(collection(...), orderBy(...))`) dan pembuatan kerangka awal untuk komponen React berdasarkan spesifikasi yang detail.

2.  **Google Gemini (Arsitektur, Debugging, & Refactoring):**
    -   **Arsitektur & Alur Kerja:** Gemini digunakan untuk diskusi tingkat tinggi, seperti merancang struktur data yang efisien di Firestore dan menentukan alur *state management* aplikasi, terutama pada implementasi *listener* `onAuthStateChanged` di `App.jsx` yang menjadi pusat logika otentikasi.
    -   **Debugging Intensif:** Saat menghadapi masalah *environment setup* yang sangat persisten (terkait `npx`, `PostCSS`, dan `Tailwind CSS` di Windows), Gemini memberikan panduan *troubleshooting* langkah demi langkah, mulai dari analisis error hingga solusi final (mengunci versi *library* yang stabil).
    -   **Refactoring & Dokumentasi:** Setelah semua fitur selesai, Gemini membantu merapikan seluruh basis kode dengan menambahkan dokumentasi standar (JSDoc) dan menghapus komentar-komentar sisa pengembangan, meningkatkan keterbacaan dan kualitas kode secara keseluruhan.

**Dampak Keseluruhan:** Kombinasi kedua AI ini menciptakan alur kerja yang sangat produktif. IBM Granite berperan sebagai *code generator* yang handal, sementara Google Gemini berperan sebagai *architect* dan *debugger*, memungkinkan proyek yang kompleks ini selesai dalam waktu yang sangat singkat.
