import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD23TR8GVPSmDZssu6g0nxnAYG4S3sH1d8",
    authDomain: "challenge-bde28.firebaseapp.com",
    projectId: "challenge-bde28",
    storageBucket: "challenge-bde28.appspot.com",
    messagingSenderId: "1070890510543",
    appId: "1:1070890510543:web:47145e534f86103cb56fba",
    measurementId: "G-93PSE5VWQ5"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();


export { db, auth };







