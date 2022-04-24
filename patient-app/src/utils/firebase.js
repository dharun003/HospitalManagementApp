// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCiozukhEh1LWZe2nDsZ-dMmmv-WWTufhw",
  authDomain: "patient-app-e52b2.firebaseapp.com",
  projectId: "patient-app-e52b2",
  storageBucket: "patient-app-e52b2.appspot.com",
  messagingSenderId: "490211367427",
  appId: "1:490211367427:web:31663dab004b28730b4c36",
  measurementId: "G-7BKTVK7061",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider(); 
export {auth , provider};