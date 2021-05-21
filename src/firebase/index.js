import firebaseConfig from './config';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const messaging = firebase.messaging();

export const getToken = async () => {
  await messaging
    .getToken({
      vapidKey:
        'BIUyUG_QMFrIpJjbOhsX6vOGxu60V7ez8KOApzAV2cA7m5WcExCmMKgvJaRuOSyUIDdwr2IxnuNXr4g9Otr2au8',
    })
    .then((currentToken) => {
      if (currentToken) {
        return window.localStorage.setItem({ token: currentToken });
      } else {
        console.log(
          'No registration token available. Request permission to generate one.'
        );
      }
    })
    .catch((err) =>
      console.log('An error occurred while retrieving token. ', err)
    );
};

export const requestPermission = async () => {
  await Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return getToken();
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
};

export default firebase;
