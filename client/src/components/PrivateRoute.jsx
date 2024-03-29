import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () =>{
    const {isLoggedIn, user, isLoading} = useContext(UserContext);
    console.log("isloading", isLoading);
    const location = useLocation();
    
    if (isLoading) {
        console.log("In loadinggggggg")
        return <Outlet><div>Loading...</div></Outlet>;
      }
    return (
        user ? <Outlet /> : <Navigate to={"/login"} replace/>
        // isLoggedIn ? <Outlet /> : <Outlet><h1>Nothing</h1></Outlet>
    )

}

export default PrivateRoute;