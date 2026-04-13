importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// You can get these from the Firebase Console (Environment Settings > General > Your Apps)
firebase.initializeApp({
  apiKey: "AIzaSyDHyxVFC0dM8uu4owE5XCkWYMgfnfjRbfQ",
  authDomain: "portfolio-696af.firebaseapp.com",
  projectId: "portfolio-696af",
  storageBucket: "portfolio-696af.firebasestorage.app",
  messagingSenderId: "207710656703",
  appId: "1:207710656703:web:5404c090ca6612dcf58e0a",
  // measurementId: "G-218710656703"
});

// const firebaseConfig = {
//   apiKey: "AIzaSyDHyxVFC0dM8uu4owE5XCkWYMgfnfjRbfQ",
//   authDomain: "portfolio-696af.firebaseapp.com",
//   projectId: "portfolio-696af",
//   storageBucket: "portfolio-696af.firebasestorage.app",
//   messagingSenderId: "207710656703",
//   appId: "1:207710656703:web:5404c090ca6612dcf58e0a"
// };

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Update with your actual icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
