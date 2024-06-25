// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorList = document.getElementById('error-list');
  errorList.innerHTML = ''; // Limpiar errores anteriores

  // Validaciones
  const errors = [];
  if (!email || !password) {
    errors.push('All fields are required');
  }

  if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }

  if (password.length < 3) {
    errors.push('Password must be at least 3 characters');
  }

  if (errors.length > 0) {
    errors.forEach(error => {
      const li = document.createElement('li');
      li.textContent = error;
      errorList.appendChild(li);
    });
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      const user = userCredential.user;
      console.log('User signed in:', user);
      M.toast({html: `${user.email} logged in`});
    })
    .catch(function (error) {
      console.error('Error signing in:', error);
      M.toast({html: `Error: ${error.message}`});
    });
});


function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
