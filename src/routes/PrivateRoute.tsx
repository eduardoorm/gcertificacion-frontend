import React from "react";
import { Navigate } from "react-router-dom";
import { useLocalState } from "../util/localStorage";

const PrivateRoute = (children: any) => {
    const [authenticated, setauthenticated] = useLocalState('token', '');
    return authenticated ? children.children : <Navigate replace to='/login' />;
}

export default PrivateRoute;