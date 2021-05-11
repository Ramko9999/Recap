import React from "react";
import {Button, message} from "antd";
import AuthService from "../../service/Auth";
import history from "../../util/History";
import UserService from "../../service/User";

const Auth = () => {

    const onSignIn = async () => {
        try{
            const credential = await AuthService.signInWithGoogle();
            if(credential.additionalUserInfo?.isNewUser){
                await UserService.createUser({
                    id: credential.user?.uid as string,
                    email: credential.user?.email as string,
                    username: credential.user?.displayName as string
                })
            }
            if(credential.user){
                history.replace("/", {});
            }
        }
        catch(error){
            const {code} = error;
            if(code !== "auth/cancelled-popup-request"){
                message.info(`Unable to sign in with ${error.email}`);
            }
        }
    }

    return (<div style={{alignContent:"center"}}>
        <Button type="primary" onClick={onSignIn}>
            Login with Google
        </Button>
    </div>)
}

export default Auth;