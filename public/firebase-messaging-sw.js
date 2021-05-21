/* eslint-disable no-undef */
// Add imports and config for firebase messaging
importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js"
);

let self;

firebase.initializeApp({
  messagingSenderId: "131840670968",
  apiKey: "AIzaSyCVt9q7hQtIDhCGj3e6klG0xDMpQY_41FY",
  projectId: "slackhelp",
  appId: "1:131840670968:web:1cad98bddc21729953cf0d",
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body || "Background Message body",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

/* 
curl -X POST -H "Authorization: key=<Server Key>" \
   -H "Content-Type: application/json" \
   -d '{
  "data": {
    "notification": {
        "title": "FCM Message",
        "body": "This is an FCM Message",
        "icon": "/itwonders-web-logo.png",
    }
  },
  "to": "<DEVICE_REGISTRATION_TOKEN>"
}' https://fcm.googleapis.com/fcm/send */
