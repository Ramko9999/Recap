import React from "react";
import {Button, message} from "antd";
import AuthService from "../../service/Auth";
import history from "../../util/History";

const Auth = () => {

    const onSignIn = async () => {
        try{
            const credential = await AuthService.signInWithGoogle();
            if(credential.user){
                const {email, displayName} = credential.user;
                console.log(email, displayName);
                history.replace("/core", {});
            }
        }
        catch(error){
            message.info(`Unable to sign in with ${error.email}`);
        }
    }

    return (<div>
        <Button type="primary" onClick={onSignIn}>
            Login with Google
        </Button>
    </div>)
}

export default Auth;