// src/firebase.js

// Import fungsi yang kita butuhkan dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCzn-y0kVfCQ7WdSVGk1f9oloi7V3nrjUI",
  authDomain: "mini-lms-capstone.firebaseapp.com",
  projectId: "mini-lms-capstone",
  storageBucket: "mini-lms-capstone.firebasestorage.app",
  messagingSenderId: "891534769378",
  appId: "1:891534769378:web:1de5e1599379ebbae172bb"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi dan ekspor layanan Firebase agar bisa digunakan di file lain
export const auth = getAuth(app);
export const db = getFirestore(app);