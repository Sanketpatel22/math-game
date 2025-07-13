// src/firebase.js

// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZFrjykP0jUw1AZXiDNyFfzFkqBnH0tes",
  authDomain: "mathquizegame.firebaseapp.com",
  projectId: "mathquizegame",
  storageBucket: "mathquizegame.firebasestorage.app",
  messagingSenderId: "820572532242",
  appId: "1:820572532242:web:8286c9cff4a3c192e2f2cb",


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
