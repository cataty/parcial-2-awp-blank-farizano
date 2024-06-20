// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBElCCPMeJCDgQfcETp6X9QNpEFRrS942I",
  authDomain: "parcial-2-pwa-farizano-blank.firebaseapp.com",
  projectId: "parcial-2-pwa-farizano-blank",
  storageBucket: "parcial-2-pwa-farizano-blank.appspot.com",
  messagingSenderId: "694550631343",
  appId: "1:694550631343:web:3520a392e2728c92d9155a",
  measurementId: "G-KEVD876QG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('username').value.trim(); // Trim spaces
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      const user = userCredential.user;
      console.log('User created:', user);
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error creating user:', errorCode, errorMessage);
    });
});