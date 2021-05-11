import {auth, googleAuthProvider} from "./Firebase";


class AuthService {

    static getIsUserSignedIn() {
        return auth.currentUser !== null;
    }

    static getUser() {
        if(!auth.currentUser) {
            throw Error("cannot get user when currentUser is null");
        }
        return auth.currentUser;
    }

    static async signInWithGoogle() {
        return auth.signInWithPopup(googleAuthProvider);
    }

    static async getAccessToken() {
        if(!auth.currentUser){
            throw Error("can not access token when currentUser is null")
        }
        return await auth.currentUser.getIdToken(true);
    }

    static async logOut(){
        if(auth.currentUser){
            await auth.signOut()
        }
    }
}


export default AuthService;