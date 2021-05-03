import React, {useState, useEffect} from "react";
import AuthService from "../../service/Auth";
import UserService, { User } from "../../service/User";
import Request from "../../util/LoadingEnum";

const UserContext = React.createContext(null) as React.Context<User>;

export const UserState = ({children}: any) => {
    const [requestState, setRequestState] = useState(Request.WAITING);
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const userId = AuthService.getUser().uid;
        UserService.getUser(userId).then((u) => {
            setUser(u);
            setRequestState(Request.SUCCESSFUL);
        }).catch((reason) => {
            setRequestState(Request.FAILED);
        });
    }, []);


    if(requestState === Request.WAITING){
        return (<div> Loading... </div>) //render loading screen
    }

    if(requestState === Request.FAILED){
        return (<div> Failed... </div>) //render failure screen
    }

    return <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
}


export default UserContext;

