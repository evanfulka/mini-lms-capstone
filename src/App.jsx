import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

/**
 * Komponen root dari aplikasi.
 * Bertanggung jawab untuk:
 * 1. Mengelola state otentikasi pengguna secara global.
 * 2. Merender halaman yang sesuai (Login, Register, atau Dashboard) berdasarkan status login.
 * 3. Menyediakan container untuk notifikasi toast.
 */
function App() {
  // State untuk menyimpan objek pengguna yang sedang login. Bernilai `null` jika tidak ada.
  const [user, setUser] = useState(null);
  // State untuk menangani tampilan loading awal saat status otentikasi diperiksa.
  const [loading, setLoading] = useState(true);
  // State untuk beralih antara tampilan form Login dan Register.
  const [isRegistering, setIsRegistering] = useState(false);

  // Listener real-time untuk perubahan status otentikasi dari Firebase.
  useEffect(() => {
    // onAuthStateChanged mengembalikan fungsi 'unsubscribe' yang bisa digunakan untuk membersihkan listener.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Fungsi cleanup ini akan berjalan saat komponen di-unmount, mencegah memory leak.
    return () => {
      unsubscribe();
    };
  }, []); // Array dependensi kosong memastikan efek ini hanya berjalan sekali saat aplikasi pertama kali dimuat.

  /** Fungsi untuk mengubah state antara tampilan Login dan Register. */
  const toggleForm = () => {
    setIsRegistering(prev => !prev);
  };

  // Selama Firebase memeriksa status login, tampilkan pesan loading.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Container Toaster agar notifikasi bisa muncul di seluruh aplikasi */}
      <Toaster position="top-center" />
      
      {/* Conditional rendering utama berdasarkan status login pengguna */}
      {user ? (
        // Jika pengguna sudah login, tampilkan Dashboard.
        <Dashboard />
      ) : (
        // Jika belum login, tampilkan form Register atau Login.
        isRegistering ? (
          <Register toggleForm={toggleForm} />
        ) : (
          <Login toggleForm={toggleForm} />
        )
      )}
    </div>
  );
}

export default App;