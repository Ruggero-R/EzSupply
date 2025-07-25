import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Test configuration - uses emulators
const testFirebaseConfig = {
  projectId: 'ezsupply-test', // Use a test project ID
  apiKey: 'test-api-key',
  authDomain: 'test.firebaseapp.com',
  storageBucket: 'test.appspot.com',
  messagingSenderId: '123456789',
  appId: 'test-app-id'
};

// Initialize Firebase app for testing
const testApp = initializeApp(testFirebaseConfig, 'test');

// Initialize Firestore and connect to emulator
export const testDb = getFirestore(testApp);
export const testAuth = getAuth(testApp);

// Connect to emulators
let emulatorConnected = false;
if (!emulatorConnected) {
  try {
    connectFirestoreEmulator(testDb, 'localhost', 8080);
    emulatorConnected = true;
  } catch (error) {
    // Emulator might already be connected
    console.log('Firestore emulator connection:', error);
  }
}

export default testApp;
