import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBgZrll4SyCD7HUzQvvCYuASsgBIutuYW8",
    authDomain: "whatsapp-2-20e75.firebaseapp.com",
    projectId: "whatsapp-2-20e75",
    storageBucket: "whatsapp-2-20e75.appspot.com",
    messagingSenderId: "166007557139",
    appId: "1:166007557139:web:1d3b473abc45c821c5c3e6"
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };