import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import auth from "./auth.js";
import db from "./firestore.js";

export function subscribeToAuthState(onChange, onError) {
  return onAuthStateChanged(auth, onChange, onError);
}

export async function getActiveStaffProfile(uid) {
  const profileSnapshot = await getDoc(doc(db, "users", uid));
  if (!profileSnapshot.exists()) return null;

  const profile = profileSnapshot.data();
  if (profile.role !== "STAFF" || profile.active !== true) return null;

  return profile;
}

export async function signInStaff(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  try {
    const profile = await getActiveStaffProfile(user.uid);
    if (profile) return { user, profile };

    const error = new Error("This account is not authorized for Staff access.");
    error.code = "staff/not-authorized";
    throw error;
  } catch (error) {
    if (auth.currentUser?.uid === user.uid) {
      await signOut(auth).catch(() => {});
    }
    throw error;
  }
}

export function sendStaffPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}

export function signOutStaff() {
  return signOut(auth);
}