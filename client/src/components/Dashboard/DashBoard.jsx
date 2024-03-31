import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import fetchBalanceSummary from "../../utils/balanceSummary.util";
import Debts from "./Debts";

const Dashboard = ({props}) => {

    const user = props.user;
    const balance = props.balance;
    const balanceDetails = props.balanceDetails;

    console.log(balanceDetails)

    return (
        
        <Box sx={{
            width: {
                xs: '100%',
                md: '75%',
            },
            display: 'block',
            padding: {md:'15px', xs:'7.5px'},
        }}>
            {!!user && (<Typography variant="h5">Hi {user.name}!</Typography>)}
            {!!user && (<Typography>Logged In as: {user.email}</Typography>)}

            {!!user && !!balanceDetails && (<Typography> Total 
                {
                balanceDetails.totalBalance > 0 ? " You get back " + balanceDetails.totalBalance : 
                " You owe " + (-(balanceDetails.totalBalance))
                }
            </Typography>)}
            {!!balance && <Debts props={balance} />}
        </Box>
    )
}

export default Dashboard;