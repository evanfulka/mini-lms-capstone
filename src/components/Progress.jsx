import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * Menampilkan halaman rekapitulasi progres belajar pengguna di semua kursus.
 * Komponen ini mengambil data dari beberapa koleksi di Firestore dan menggabungkannya
 * untuk menampilkan kalkulasi progres dalam bentuk progress bar.
 *
 * @param {object} props - Props yang diterima komponen.
 * @param {Function} props.backToDashboard - Fungsi untuk kembali ke tampilan Dashboard utama.
 */
const Progress = ({ backToDashboard }) => {
  // State untuk menyimpan data progres yang sudah dikalkulasi dan status loading UI.
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  // Mengambil dan menggabungkan (aggregate) data progres saat komponen dimuat.
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        // Langkah 1: Mengambil data pelajaran yang sudah diselesaikan oleh pengguna.
        const userProgressRef = doc(db, 'users', currentUser.uid);
        const userProgressSnap = await getDoc(userProgressRef);
        const completedData = userProgressSnap.exists() ? userProgressSnap.data().completedLessons : {};

        // Langkah 2: Mengambil semua data kursus yang tersedia.
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        
        // Langkah 3: Untuk setiap kursus, hitung total pelajaran dan bandingkan dengan progres pengguna.
        // Promise.all digunakan untuk menjalankan semua query (menghitung total pelajaran) secara paralel agar lebih efisien.
        const detailedProgress = await Promise.all(
          coursesSnapshot.docs.map(async (courseDoc) => {
            const course = { id: courseDoc.id, ...courseDoc.data() };
            
            const lessonsSnapshot = await getDocs(collection(db, `courses/${course.id}/lessons`));
            const totalLessons = lessonsSnapshot.size;
            const completedCount = completedData[course.id]?.length || 0;
            
            return {
              ...course,
              totalLessons,
              completedCount,
            };
          })
        );

        setProgressData(detailedProgress);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser]);

  // Menampilkan pesan loading saat data sedang diproses.
  if (loading) {
    return <p className="text-center mt-8">Menghitung progres Anda...</p>;
  }

  return (
    <div className="p-8">
      <button onClick={backToDashboard} className="mb-6 text-indigo-600 hover:underline">
        &larr; Kembali ke Dashboard
      </button>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Progres Belajar Saya</h2>
      <div className="space-y-4">
        {progressData.map(course => (
          <div key={course.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-bold text-gray-800">{course.title}</h3>
            <p className="text-sm text-gray-600">
              {course.completedCount} / {course.totalLessons} pelajaran selesai
            </p>
            <div className="w-full mt-2 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${(course.completedCount / course.totalLessons) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;