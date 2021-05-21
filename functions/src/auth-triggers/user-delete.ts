import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
const adminDB = admin.firestore();
const auth = functions.auth;
const firestore = functions.firestore;
const timestamp = admin.firestore.FieldValue.serverTimestamp();


export const deleteUserAccount = auth
  .user().onDelete(async (user, context) => {


    try {
      const userID = user.uid;
      const userRef = adminDB.doc(`users/${ userID }`);

      if (user) {
        console.info(`User ${ after.uid } signed out at ${ context.timestamp }`);
        // Decrement online users counter
        batch.update(onlineUserCount, { count: decrement });
        // Update the timestamp value in user doc
        batch.update(userRef, { updatedAt: timestamp });
      } else {
        console.info(`User ${ after.uid } signed in at ${ context.timestamp }`);
        // Increment online users counter
        batch.update(onlineUserCount, { count: increment });
        // Update the timestamp value in user doc
        batch.update(userRef, { updatedAt: timestamp });
      }
      // Batch transactions will all succeed or fail together
      return batch.commit();
    } catch (error) {
      console.error(error);
    }
    return null;
  });
