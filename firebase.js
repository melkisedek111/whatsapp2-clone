import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDfuPKIbRS-TC9jYZouzuS5mpQY-cpovUU",
    authDomain: "whatsapp2-a0b40.firebaseapp.com",
    projectId: "whatsapp2-a0b40",
    storageBucket: "whatsapp2-a0b40.appspot.com",
    messagingSenderId: "718924844222",
    appId: "1:718924844222:web:20449a3743c10a00c022ef"
};


const app = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();


export {db, auth, provider};

