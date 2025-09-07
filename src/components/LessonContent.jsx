import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Menampilkan konten dari satu pelajaran individual.
 * Komponen ini mengambil datanya sendiri dari Firestore berdasarkan ID yang diterima.
 *
 * @param {object} props - Props yang diterima komponen.
 * @param {string} props.courseId - ID dari kursus induk.
 * @param {string} props.lessonId - ID dari pelajaran yang akan ditampilkan.
 * @param {Function} props.backToLessonList - Fungsi untuk kembali ke daftar pelajaran.
 * @param {Function} props.markAsComplete - Fungsi untuk menandai pelajaran ini sebagai selesai.
 */
const LessonContent = ({ courseId, lessonId, backToLessonList, markAsComplete }) => {
  // State untuk menyimpan data pelajaran dan status loading UI.
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mengambil data spesifik untuk satu pelajaran dari Firestore saat komponen dimuat.
  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const lessonRef = doc(db, `courses/${courseId}/lessons/${lessonId}`);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
          setLesson({ id: lessonSnap.id, ...lessonSnap.data() });
        } else {
          console.log("No such lesson!");
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]); // Efek ini akan berjalan kembali jika ID kursus atau pelajaran berubah.

  /**
   * Menjalankan fungsi `markAsComplete` dari parent, lalu memanggil fungsi untuk kembali
   * ke daftar pelajaran.
   */
  const handleComplete = () => {
    markAsComplete(lessonId);
    backToLessonList();
  };

  // Menampilkan pesan loading saat data sedang diambil.
  if (loading) {
    return <p className="text-center mt-8">Memuat materi...</p>;
  }

  // Menampilkan pesan jika karena suatu hal data pelajaran tidak ditemukan.
  if (!lesson) {
    return <p className="text-center mt-8">Materi tidak ditemukan.</p>;
  }

  return (
    <div className="p-8">
      <button onClick={backToLessonList} className="mb-6 text-indigo-600 hover:underline">
        &larr; Kembali ke Daftar Pelajaran
      </button>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-3xl font-bold text-gray-800">{lesson.title}</h2>
        <div className="prose max-w-none text-gray-700">
          <p>{lesson.content}</p>
        </div>
        <hr className="my-8" />
        <button
          onClick={handleComplete}
          className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Tandai sebagai Selesai & Kembali
        </button>
      </div>
    </div>
  );
};

export default LessonContent;