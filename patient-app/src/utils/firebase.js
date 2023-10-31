// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";

//import 'firebase/storage';
//import firebase from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  // apiKey: "AIzaSyBdBrrytuZ6g1rycQwfeWhkDR2PodQzE_o",
  // authDomain: "patient-app-b88e1.firebaseapp.com",
  // projectId: "patient-app-b88e1",
  // storageBucket: "patient-app-b88e1.appspot.com",
  // messagingSenderId: "398426932384",
  // appId: "1:398426932384:web:9186aa1eac6d1b0a3db5c5",
  // measurementId: "G-0LGKLFFBKF"
  apiKey: "AIzaSyC60HFHzqUZZy6RVO9YkPKhSPgu6k91c8g",
  authDomain: "hospitalmanagementapp-78c62.firebaseapp.com",
  projectId: "hospitalmanagementapp-78c62",
  storageBucket: "hospitalmanagementapp-78c62.appspot.com",
  messagingSenderId: "826614165425",
  appId: "1:826614165425:web:ff5cc0b491b1571f89d790",
  measurementId: "G-VWFKWS6W11"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

const auth = getAuth(app);
(async () => {
  await setPersistence(auth, browserLocalPersistence);
})()

const provider = new GoogleAuthProvider(); 
export {auth , provider};