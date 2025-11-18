import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyClAU5v7361XNa2vTueat31LYAaaIyV8Eg",
  authDomain: "ccfm-ai-studio.firebaseapp.com",
  projectId: "ccfm-ai-studio",
  storageBucket: "ccfm-ai-studio.firebasestorage.app",
  messagingSenderId: "940489272584",
  appId: "1:940489272584:web:4437ffeadd62aaee6c10bd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();