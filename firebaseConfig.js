// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnMTqGGItjcTQ2UFGHZ9Nx7Z1SZuzb5fw",
  authDomain: "itians-63b47.firebaseapp.com",
  projectId: "itians-63b47",
  storageBucket: "itians-63b47.firebasestorage.app",
  messagingSenderId: "178770348002",
  appId: "1:178770348002:web:270b9431d612a43d299bbb",
  measurementId: "G-ZNWKYWNL9Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
