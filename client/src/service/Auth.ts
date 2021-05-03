import {auth, googleAuthProvider} from "./Firebase";


class AuthService {

    static getIsUserSignedIn() {
        return auth.currentUser !== null;
    }

    static getUser() {
        if(!auth.currentUser) {
            throw Error('AuthService.getUser invoked when no user is signed in');
        }
        return auth.currentUser;
    }

    static async signInWithGoogle() {
        return auth.signInWithPopup(googleAuthProvider);
    }
}


export default AuthService;