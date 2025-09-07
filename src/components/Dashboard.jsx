import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import CourseDetail from './CourseDetail';
import Progress from './Progress';

/**
 * Komponen utama setelah pengguna berhasil login.
 * Bertindak sebagai container yang mengatur tampilan antara daftar kursus,
 * detail kursus, dan halaman progres pengguna.
 */
const Dashboard = () => {
  // State untuk manajemen tampilan/view yang sedang aktif.
  const [activeView, setActiveView] = useState('courses'); // 'courses', 'detail', 'progress'
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  
  // State untuk manajemen data kursus dan status loading.
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data kursus dari Firestore saat komponen pertama kali dimuat.
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesQuery = query(collection(db, 'courses'), orderBy('order'));
        const querySnapshot = await getDocs(coursesQuery);
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /** Menangani proses logout pengguna dari Firebase. */
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) { // <-- BAGIAN INI YANG SEBELUMNYA ERROR & KINI DIPERBAIKI
      console.error('Error logging out:', error);
    }
  };

  /** Mengubah view untuk menampilkan detail kursus yang dipilih. */
  const navigateToCourseDetail = (courseId) => {
    setSelectedCourseId(courseId);
    setActiveView('detail');
  };

  /** Mengubah view kembali ke daftar kursus utama. */
  const navigateToDashboard = () => {
    setSelectedCourseId(null);
    setActiveView('courses');
  };
  
  /** Mengubah view ke halaman progres pengguna. */
  const navigateToProgress = () => {
    setActiveView('progress');
  };
  
  /** Komponen header aplikasi yang dapat digunakan kembali. */
  const AppHeader = () => (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-indigo-600 cursor-pointer" onClick={navigateToDashboard}>Mini LMS</h1>
      <div>
        <button onClick={navigateToProgress} className="px-4 py-2 mr-4 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
          Progres Saya
        </button>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );

  /**
   * Menentukan dan merender konten utama berdasarkan state `activeView`.
   * @returns {JSX.Element} Komponen yang akan dirender (Daftar Kursus, Detail, atau Progres).
   */
  const renderContent = () => {
    if (loading) {
      return <p className="p-8 text-center">Memuat kursus...</p>;
    }
    
    switch (activeView) {
      case 'detail':
        return <CourseDetail courseId={selectedCourseId} backToDashboard={navigateToDashboard} />;
      case 'progress':
        return <Progress backToDashboard={navigateToDashboard} />;
      case 'courses':
      default:
        return (
          <main className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Daftar Kursus</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <div key={course.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl">
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{course.description}</p>
                  <button onClick={() => navigateToCourseDetail(course.id)} className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Mulai Belajar
                  </button>
                </div>
              ))}
            </div>
          </main>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />
      {renderContent()}
    </div>
  );
};

export default Dashboard;