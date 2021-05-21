/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/8.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/8.6.1/firebase-messaging.js");
// importScripts("/__/firebase/init.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCVt9q7hQtIDhCGj3e6klG0xDMpQY_41FY",
  authDomain: "slackhelp.firebaseapp.com",
  databaseURL: "https://slackhelp-default-rtdb.firebaseio.com",
  projectId: "slackhelp",
  storageBucket: "slackhelp.appspot.com",
  messagingSenderId: "131840670968",
  appId: "1:131840670968:web:1cad98bddc21729953cf0d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
