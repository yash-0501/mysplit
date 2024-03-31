import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import fetchBalanceSummary from "../../utils/balanceSummary.util";

const LandingContent = ({props}) => {

    const user = props;

    const [balanceDetails, setBalanceDetails] = useState(null);

    useEffect(()=>{
        fetchBalanceSummary(setBalanceDetails);
    }, []);

    console.log(balanceDetails)

    return (
        
        <Box sx={{
            width: {
                xs: '100%',
                md: '75%',
            },
            background: 'red',
            display: 'block'
        }}>
            <Typography variant="h1">Landing Page</Typography>
            {!!user && (<Typography variant="h5">Hi {user.name}!</Typography>)}
            {!!user && (<Typography>Logged In as: {user.email}</Typography>)}

            {!!user && !!balanceDetails && (<Typography>
                {
                balanceDetails.totalBalance > 0 ? "You get back " + balanceDetails.totalBalance : 
                "You owe " + (-(balanceDetails.totalBalance))
                }
            </Typography>)}
        </Box>
    )
}

export default LandingContent;