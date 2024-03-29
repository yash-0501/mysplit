import { useContext, useEffect, useState } from "react";
import UseAuth from "../../hooks/useAuth";
import UserContext from "../../../context/userContext";
import Header from "../../components/header/header";

const LandingPage = () =>{
    
    const {user} = useContext(UserContext);
    console.log(user);
   
    return (
        <>
            <Header props={user} />
            <h1>Landing Page</h1>
            {!!user && (<h2>Hi {user.name}!</h2>)}
            {!!user && (<p>Logged In as: {user.email}</p>)}
        </>
    )
}

export default LandingPage;