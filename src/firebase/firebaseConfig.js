import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA1PykfI8FXbnrQ5xZAIsV-DiWSXGv-8dA",
  authDomain: "rock-paper-scissors-8f404.firebaseapp.com",
  projectId: "rock-paper-scissors-8f404",
  storageBucket: "rock-paper-scissors-8f404.appspot.com",
  messagingSenderId: "150695165350",
  appId: "1:150695165350:web:2f603697f901792291a367",
  measurementId: "G-31W501Y01R"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
export { app, analytics, auth, db};