import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbnjelTLvylcsfks_BukE2i2SKsoZtVog",
  authDomain: "magx-portal-c03d8.firebaseapp.com",
  projectId: "magx-portal-c03d8",
  storageBucket: "magx-portal-c03d8.firebasestorage.app",
  messagingSenderId: "1076489415753",
  appId: "1:1076489415753:web:0406e2db52cb5db647e398"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
