import firebase, { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, connectAuthEmulator } from "firebase/auth";
import {  getFirestore,connectFirestoreEmulator  } from "firebase/firestore";
import 'firebase/auth';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCX_Fs3KXQBAH-0N2D8CYWY30QG9SSFmaY",
  authDomain: "chatapp-f8f6c.firebaseapp.com",
  projectId: "chatapp-f8f6c",
  storageBucket: "chatapp-f8f6c.appspot.com",
  messagingSenderId: "532182057655",
  appId: "1:532182057655:web:d48db843fd883935084332",
  measurementId: "G-QXLLCD8DTB"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const provider = new FacebookAuthProvider();
const auth = getAuth();
//connectAuthEmulator(auth,'http://localhost:9099');
const db = getFirestore();
//connectFirestoreEmulator(db, "localhost", 8080);


export {auth, provider, db};