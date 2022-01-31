import firebase from "firebase";
import firebaseConfig from "../config/firebase.json"

const app = firebase.initializeApp(firebaseConfig);


const auth = app.auth();
const storage = app.storage();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

const LOCAL_PERSISTANCE = firebase.auth.Auth.Persistence.LOCAL;

export {auth, storage, googleAuthProvider, LOCAL_PERSISTANCE};