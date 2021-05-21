import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
const adminDB = admin.firestore();
const auth = functions.auth;
const timestamp = admin.firestore.FieldValue.serverTimestamp();

export const createUserAccount = auth
  .user().onCreate(async (user, context) => {

    try {
      const uid = user.uid;
      const email = user.email;
      const username = user.displayName;
      const userRef = adminDB.doc(`users/${ uid }`);

      console.info(`New user ${ username } created with an event ID: ${ context.eventId }.`);

      return userRef.set({
        uid: uid,
        email: email,
        username: username,
        createdAt: timestamp,
      });

    } catch (error) {
      console.error(error);
    }
    return null;
  });
