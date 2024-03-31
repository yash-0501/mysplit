import { useContext, useEffect, useState } from "react";
import UseAuth from "../../hooks/useAuth";
import UserContext from "../../../context/userContext";
import Header from "../../components/header/header";
import ActivityBar from "../../components/activityBar/ActivityBar";
import { Box, Container } from "@mui/material";
import fetchExpenses from "../../utils/activity.util";
import fetchBalance from "../../utils/balance.utl";
import fetchBalanceSummary from "../../utils/balanceSummary.util";
import Dashboard from "../../components/Dashboard/DashBoard";

const LandingPage = () =>{
    
    const {user} = useContext(UserContext);
    console.log(user);

    const [expenses, setExpenses] = useState([]);
    const [balance, setBalance] = useState([]);
    const [balanceDetails, setBalanceDetails] = useState(null);
    const [currUser, setCurrUser] = useState(null);

    
    

    useEffect(() => {
        fetchExpenses(setExpenses);
        fetchBalance(setBalance);
        fetchBalanceSummary(setBalanceDetails);
        setCurrUser(user);
      }, []);
   
    return (
        <>
        <Header props={user} />
        <Container>
            <Box sx={{width:'100%', display: 'flex'}}>
            <Dashboard props={{user: {...currUser}, balance, balanceDetails}} />
            <ActivityBar props={{user: {...currUser}, expenses}} />
            </Box>
            
            
            
        </Container>
        </>
    )
}

export default LandingPage;