import firebase from "firebase";
import firebaseConfig from "../config/firebase.json"

const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export {auth, googleAuthProvider};