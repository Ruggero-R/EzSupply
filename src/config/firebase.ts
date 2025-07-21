import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9iaOvdJnsHWfAZuQ5VOFdDv-7Ny2ZUOM",
  authDomain: "ezsupply-bd64a.firebaseapp.com",
  projectId: "ezsupply-bd64a",
  storageBucket: "ezsupply-bd64a.firebasestorage.app",
  messagingSenderId: "163586598757",
  appId: "1:163586598757:web:eb2d28d40730c933f4238c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
