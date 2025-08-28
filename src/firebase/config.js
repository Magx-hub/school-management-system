import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBd6_jEA6SrI4si7f4sDyIhq3TMFYuvWNk",
  authDomain: "canteen-fee-project.firebaseapp.com",
  projectId: "canteen-fee-project",
  storageBucket: "canteen-fee-project.firebasestorage.app",
  messagingSenderId: "224947876513",
  appId: "1:224947876513:web:6f24c802d42fab8c5bb6e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
