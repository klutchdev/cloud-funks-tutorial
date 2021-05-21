/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// import firebase from "firebase/app";
// import "firebase/messaging";

importScripts("https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCVt9q7hQtIDhCGj3e6klG0xDMpQY_41FY",
  authDomain: "slackhelp.firebaseapp.com",
  databaseURL: "https://slackhelp-default-rtdb.firebaseio.com",
  projectId: "slackhelp",
  storageBucket: "slackhelp.appspot.com",
  messagingSenderId: "131840670968",
  appId: "1:131840670968:web:1cad98bddc21729953cf0d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
