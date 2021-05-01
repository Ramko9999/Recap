import {auth, googleAuthProvider} from "./Firebase";


class AuthService {

    static getIsUserSignedIn() {
        return auth.currentUser !== null;
    }

    static getUserId() {
        if(!auth.currentUser) {
            throw Error('AuthService.getUserId invoked when no user is signed in');
        }
        return auth.currentUser.uid;
    }

    static async signInWithGoogle() {
        return auth.signInWithPopup(googleAuthProvider);
    }
}


export default AuthService;