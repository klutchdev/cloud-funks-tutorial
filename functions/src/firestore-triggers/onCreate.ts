import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
const adminDB = admin.firestore();
const firestore = functions.firestore;
const timestamp = admin.firestore.FieldValue.serverTimestamp();

export const newOrder = firestore
  .document(`orders/{uid}`)
  .onCreate(async (snap, context) => {

    try {
      const batch = adminDB.batch();
      const uid = context.auth.uid;
      const email = snap.data().email;
      const orderId = snap.data().orderId;
      const ordersRef = adminDB.doc(`orders/${ uid }`);
      const trackerRef = adminDB.doc(`tracker/${ email }`);


      batch.set(ordersRef, {
        uid: uid,
        orderId: orderId,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: "pending",
      });

      batch.set(trackerRef, {
        uid: uid,
        updatedAt: timestamp,
        status: "pending",
      });

      return batch.commit();
    } catch (error) {
      console.error(error);
    }
    return null;
  });
