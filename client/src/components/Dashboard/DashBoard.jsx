import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import fetchBalanceSummary from "../../utils/balanceSummary.util";
import Debts from "./Debts";
import BalanceSummary from "./BalanceSummary";

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
            
            <Box sx={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width:'100%',
                }}>
            <Paper elevation={8} sx={{
                backgroundColor:'lightgrey',
                borderRadius:'0px',
                border: '1px solid grey',
                borderBottom: '1px solid grey',
                px:2,
                width:'100%',
            }}>
                <Box sx={{
                    py:1
                }}>
                    <Typography variant="h5" fontSize={'2.25em'} color={'primary'} fontWeight={'800'} textAlign={'center'} >DashBoard</Typography>
                    <Divider variant="middle" />
                </Box>
                
                
                <Box sx={{
                    '.MuiButton-root':{textTransform:'capitalize'},
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {!!user && (<Typography variant="h6">Hey, <i>{user.name}!</i></Typography>)}  
                    <Box>
                        <Button variant="contained" color="error" href="/expenses/add" sx={{
                            ml:2,
                            my:1
                        }} size="small">Add Split?</Button>   
                        <Button variant="contained" color="success" href="/settle" sx={{
                            ml:2,
                            my:1
                        }} size="small">Settle Now?</Button>   
                        <Button variant="contained" color="warning"  href="/groups/add" sx={{
                            ml:2,
                            my:1
                        }} size="small">Join Friends?</Button>
                    </Box>   
                </Box>
                
            </Paper>
            </Box>

            {!!user && !!balanceDetails && (<BalanceSummary props={balanceDetails} />)}
            {!!balance && <Debts props={balance} />}
        </Box>
    )
}

export default Dashboard;