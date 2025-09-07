import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

/**
 * Komponen untuk menampilkan dan menangani form login pengguna.
 * Menggunakan Firebase Authentication untuk memvalidasi kredensial.
 *
 * @param {object} props - Props yang diterima komponen.
 * @param {Function} props.toggleForm - Fungsi untuk beralih ke tampilan form registrasi.
 */
const Login = ({ toggleForm }) => {
  // State untuk menyimpan nilai dari input email dan password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Menangani proses submit form login.
   * Mengirimkan kredensial ke Firebase dan menampilkan notifikasi toast.
   * @param {React.FormEvent<HTMLFormElement>} e - Event submit dari form.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah halaman refresh saat form disubmit.
    const loadingToast = toast.loading('Logging in...');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.dismiss(loadingToast);
      toast.success('Login berhasil!');
      // Proses redirect ke dashboard ditangani secara otomatis oleh listener di App.jsx.
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Gagal login. Periksa kembali email dan password Anda.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login ke Mini LMS</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password Anda"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <button onClick={toggleForm} className="font-medium text-indigo-600 hover:text-indigo-500">
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;