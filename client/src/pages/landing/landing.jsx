import { useContext, useEffect, useState } from "react";
import UseAuth from "../../hooks/useAuth";
import UserContext from "../../../context/userContext";
import Header from "../../components/header/header";
import ActivityBar from "../../components/activityBar/ActivityBar";
import LandingContent from "../../components/LandingContent/LandingContent";
import { Box } from "@mui/material";

const LandingPage = () =>{
    
    const {user} = useContext(UserContext);
    console.log(user);
   
    return (
        <>
            <Header props={user} />
            <Box sx={{width:'100vw', display: 'flex'}}>
            <LandingContent props={user} />
            <ActivityBar props={user} />
            </Box>
            
            
            
        </>
    )
}

export default LandingPage;