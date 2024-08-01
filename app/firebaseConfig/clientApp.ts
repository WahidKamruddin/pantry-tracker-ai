import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCP-IbQ7fVO3eJyaSve9am4MwLxR6feRHU",
  authDomain: "pantry-tracker-bd452.firebaseapp.com",
  projectId: "pantry-tracker-bd452",
  storageBucket: "pantry-tracker-bd452.appspot.com",
  messagingSenderId: "937835916876",
  appId: "1:937835916876:web:a1302fa5b1942773128ee9",
  measurementId: "G-NWGW14SN7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
