import React, {useState, useEffect} from "react";
import AuthService from "../../service/Auth";
import UserService, { User } from "../../service/User";
import Request from "../../util/LoadingEnum";
import {message} from "antd";

const UserContext = React.createContext(null) as React.Context<User>;


export const UserState = ({children}: any) => {
    const [requestState, setRequestState] = useState(Request.WAITING);
    const [user, setUser] = useState<User>(null);

    const getUser = async () => {
        const firebaseUser = AuthService.getUser();
        return await UserService.getUser(firebaseUser.uid);
    }

    useEffect(() => {
        getUser().then((u) => {
            setUser(u);
            setRequestState(Request.SUCCESSFUL);
        }).catch((error) => {
            message.error(error.message);
            setRequestState(Request.FAILED);
        });
    }, []);


    if(requestState === Request.WAITING){
        return (<div> Loading... </div>) 
    }

    if(requestState === Request.FAILED){
        return (<div> Failed... </div>) 
    }

    return <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
}


export default UserContext;

