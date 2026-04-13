import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// [TIP] Use your own Firebase credentials here.
// You can get these from the Firebase Console (Environment Settings > General > Your Apps)
const firebaseConfig = {
  apiKey: "AIzaSyDHyxVFC0dM8uu4owE5XCkWYMgfnfjRbfQ",
  authDomain: "portfolio-696af.firebaseapp.com",
  projectId: "portfolio-696af",
  storageBucket: "portfolio-696af.firebasestorage.app",
  messagingSenderId: "207710656703",
  appId: "1:207710656703:web:5404c090ca6612dcf58e0a",
  // measurementId: "G-218710656703"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDHyxVFC0dM8uu4owE5XCkWYMgfnfjRbfQ",
//   authDomain: "portfolio-696af.firebaseapp.com",
//   projectId: "portfolio-696af",
//   storageBucket: "portfolio-696af.firebasestorage.app",
//   messagingSenderId: "207710656703",
//   appId: "1:207710656703:web:5404c090ca6612dcf58e0a"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { db, messaging, getToken, onMessage };
