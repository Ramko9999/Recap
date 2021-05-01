import React from "react";
import { Redirect, Route} from "react-router-dom";
import AuthService from "../service/Auth";

type ProtectedProps = {
    path:string,
    children: any
}

const Protected = ({path, children} : ProtectedProps) => {
    return (<Route path={path}>
        {
            AuthService.getIsUserSignedIn() ? children : <Redirect to="/login"/>
        }
        </Route>);
}       

export default Protected;