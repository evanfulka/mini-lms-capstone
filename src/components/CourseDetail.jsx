import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import LessonContent from './LessonContent';

/**
 * Menampilkan detail sebuah kursus, termasuk daftar pelajarannya (lessons).
 * Komponen ini mengelola tampilan antara daftar pelajaran dan konten pelajaran individual.
 *
 * @param {object} props - Props yang diterima komponen.
 * @param {string} props.courseId - ID dari dokumen kursus di Firestore.
 * @param {Function} props.backToDashboard - Fungsi untuk kembali ke tampilan Dashboard utama.
 */
const CourseDetail = ({ courseId, backToDashboard }) => {
  // State untuk menyimpan data yang diambil dari Firestore.
  const [lessons, setLessons] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [completedLessons, setCompletedLessons] = useState(new Set());
  
  // State untuk mengelola UI, seperti loading dan view yang aktif.
  const [loading, setLoading] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const currentUser = auth.currentUser;

  // Mengambil data pelajaran dan progres pengguna saat komponen dimuat
  // atau saat pengguna kembali dari melihat konten pelajaran.
  useEffect(() => {
    // Kondisi ini mencegah pengambilan data ulang yang tidak perlu jika pengguna sedang melihat konten.
    if (!selectedLessonId) {
      const fetchData = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
          // Mengambil judul kursus dari dokumen induk.
          const courseRef = doc(db, 'courses', courseId);
          const courseSnap = await getDoc(courseRef);
          if (courseSnap.exists()) {
            setCourseTitle(courseSnap.data().title);
          }

          // Mengambil daftar pelajaran dari sub-koleksi.
          const lessonsQuery = query(collection(db, `courses/${courseId}/lessons`), orderBy('order'));
          const lessonsSnapshot = await getDocs(lessonsQuery);
          const lessonsData = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLessons(lessonsData);

          // Mengambil data progres yang sudah diselesaikan oleh pengguna untuk kursus ini.
          const userProgressRef = doc(db, 'users', currentUser.uid);
          const userProgressSnap = await getDoc(userProgressRef);
          if (userProgressSnap.exists()) {
            const progressData = userProgressSnap.data().completedLessons?.[courseId] || [];
            setCompletedLessons(new Set(progressData));
          }
        } catch (error) {
          console.error("Error fetching course details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [courseId, currentUser, selectedLessonId]);

  /**
   * Menandai sebuah pelajaran sebagai selesai di Firestore dan memperbarui state lokal.
   * @param {string} lessonId - ID dari pelajaran yang akan ditandai selesai.
   */
  const markAsComplete = async (lessonId) => {
    const userProgressRef = doc(db, 'users', currentUser.uid);
    const fieldPath = `completedLessons.${courseId}`;
    
    // Menggunakan setDoc dengan merge untuk membuat/memperbarui dokumen progres pengguna.
    await setDoc(userProgressRef, { completedLessons: { [courseId]: arrayUnion(lessonId) } }, { merge: true });
    
    // Memperbarui state lokal secara langsung untuk memberikan respons UI yang instan.
    setCompletedLessons(prev => new Set(prev).add(lessonId));
  };

  if (loading) {
    return <p className="text-center mt-8">Memuat pelajaran...</p>;
  }

  // Jika ada pelajaran yang dipilih, render komponen konten pelajaran.
  if (selectedLessonId) {
    return (
      <LessonContent
        courseId={courseId}
        lessonId={selectedLessonId}
        backToLessonList={() => setSelectedLessonId(null)}
        markAsComplete={markAsComplete}
      />
    );
  }

  // Jika tidak, render daftar pelajaran untuk kursus ini.
  return (
    <div className="p-8">
      <button onClick={backToDashboard} className="mb-6 text-indigo-600 hover:underline">
        &larr; Kembali ke Daftar Kursus
      </button>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Daftar Pelajaran - {courseTitle}</h2>
      <ul className="space-y-4">
        {lessons.map(lesson => (
          <li 
            key={lesson.id} 
            onClick={() => setSelectedLessonId(lesson.id)} 
            className="flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
          >
            <div className="flex-shrink-0 w-6 h-6">
              {completedLessons.has(lesson.id) ? (
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className={`ml-4 ${completedLessons.has(lesson.id) ? 'text-gray-500' : 'text-gray-800'}`}>
              {lesson.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetail;