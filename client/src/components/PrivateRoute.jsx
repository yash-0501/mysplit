import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () =>{
    console.log("HERE!")
    const { user, isLoading} = useContext(UserContext);
    console.log("isloading", isLoading, user);
    const location = useLocation();
    console.log(user, isLoading);
    if (isLoading) {
        console.log("In loadinggggggg")
        return <div>Loading...</div>;
      }
    return (
        user? <Outlet /> : <Navigate to={"/login"} replace/>
        // isLoggedIn ? <Outlet /> : <Outlet><h1>Nothing</h1></Outlet>
    )

}

export default PrivateRoute;