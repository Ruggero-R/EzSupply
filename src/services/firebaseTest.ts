// Test Firebase connection
// You can run this to test if Firebase is properly configured

import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    // Try to access a collection (it doesn't need to exist)
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('Firebase connection successful!');
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
};
