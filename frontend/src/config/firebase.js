import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjWsnMBPBCNcJMkkQicOWphgFN7D_8sI4",
  authDomain: "library-mevn-e76ff.firebaseapp.com",
  projectId: "library-mevn-e76ff",
  storageBucket: "library-mevn-e76ff.firebasestorage.app",
  messagingSenderId: "851778327192",
  appId: "1:851778327192:web:1bcb134368859c4ca5b6ed",
  measurementId: "G-T4E6JYKQR3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };