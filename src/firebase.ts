import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDR5h850alo3r7PiTB4LmnLZAyeEDApeLA",
  authDomain: "max-fashion-7a1ee.firebaseapp.com",
  projectId: "max-fashion-7a1ee",
  storageBucket: "max-fashion-7a1ee.firebasestorage.app",
  messagingSenderId: "206328260671",
  appId: "1:206328260671:web:93839dc771518cfd98708a",
  measurementId: "G-CV5JDP974C"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app); // Can be used when analytics is needed
