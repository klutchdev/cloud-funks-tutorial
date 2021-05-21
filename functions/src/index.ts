import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
const adminDB = admin.firestore();
const firestore = functions.firestore;
const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);
const timestamp = admin.firestore.FieldValue.serverTimestamp();
const onlineUserCount = adminDB.doc('counters/users-online');



//==================| Firestore reference |=======================//
//------
// [COLLECTION] => [DOCUMENT] => { FIELD: <TYPE> }
//------
// ["counters"] => ["users-online"] => { count: <number> }
// ["user-status"] => [uid] => { isOnline: <boolean> }
// ["users"] => [uid] => { uid: <string>, updatedAt: <timestamp> }
//-------
//==================================================================//

export const updateOnlineUser = firestore

  .document(`user-status/{uid}`)
  .onUpdate(async (snap, context) => {

    try {
      const batch = adminDB.batch();
      const after = snap.after.data();

      // Add user auth checks here or the updates fail!!!
      const userRef = adminDB.doc(`users/${ after.uid }`);

      if (after.isOnline === false) {
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
