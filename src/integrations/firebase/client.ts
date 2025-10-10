// Firebase client initialization for use throughout your app.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace with your own Firebase config from project settings.
const firebaseConfig = {
  apiKey: "AIzaSyD_sgeY7EFMjYSGKemvu-RabgpercblEqg",
  authDomain: "beinspiredmagazine-e7ea8.firebaseapp.com",
  projectId: "beinspiredmagazine-e7ea8",
  storageBucket: "beinspiredmagazine-e7ea8.firebasestorage.app",
  messagingSenderId: "802251074536",
  appId: "1:802251074536:web:73a04bd330dce85c71925d",
  measurementId: "G-0YY73WB17Q"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);