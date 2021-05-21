import { auth } from './index';

export const signOut = () => auth.signOut();

export const signUpWithEmail = async (email, password) => {
  await auth
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => alert(error));
};

export const signInWithEmail = async (email, password) => {
  await auth
    .signInWithEmailAndPassword(email, password)
    .then(() => console.log('success'))
    .catch((error) => alert(error));
};
