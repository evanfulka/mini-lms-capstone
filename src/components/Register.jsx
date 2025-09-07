import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

/**
 * Komponen untuk menampilkan form registrasi pengguna baru.
 * Mendaftarkan pengguna baru menggunakan Firebase Authentication dan memberikan feedback via notifikasi toast.
 *
 * @param {object} props - Props yang diterima komponen.
 * @param {Function} props.toggleForm - Fungsi untuk beralih kembali ke tampilan form login.
 */
const Register = ({ toggleForm }) => {
  // State untuk menyimpan nilai dari input email dan password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Menangani proses submit form registrasi.
   * Memvalidasi input, membuat akun pengguna baru di Firebase, dan menampilkan notifikasi.
   * @param {React.FormEvent<HTMLFormElement>} e - Event submit dari form.
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi dasar untuk panjang password sebelum mengirim ke Firebase.
    if (password.length < 6) {
      toast.error('Password harus minimal 6 karakter.');
      return;
    }

    const loadingToast = toast.loading('Mendaftarkan...');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.dismiss(loadingToast);
      toast.success('Registrasi berhasil!');

      // Memberi jeda sebelum beralih ke form login agar pengguna sempat membaca notifikasi.
      setTimeout(() => {
        toggleForm();
      }, 1500);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Gagal mendaftar. Mungkin email sudah digunakan.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Buat Akun Baru</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="anda@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Daftar
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <button onClick={toggleForm} className="font-medium text-indigo-600 hover:text-indigo-500">
            Login di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;