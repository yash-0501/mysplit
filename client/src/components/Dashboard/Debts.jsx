import { Avatar, Box, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const Debts = ({props}) =>{

    const debts = props.debts;
    
    let owes = [], getBacks = [];

    if(debts){
        owes = debts.owes;
        getBacks = debts.getBacks;
    }

    console.log(getBacks);
    
    const debtsTable = (
        <Paper sx={{ p: 2, height: '100%' }} >
        <Grid container spacing={2} >
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{fontWeight: '600', color: 'grey'}} >You Owe</Typography>
            <List>
            {owes.map((debt, index) => (
                <ListItem alignItems="flex-start" key={index}>
                    <ListItemAvatar>
                        <Avatar alt={debt.to.name} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                    sx={{
                        '.MuiListItemText-secondary':{
                                position: "absolute",
                                bottom:10
                        }
                    }}
                    primary={
                        <Typography variant="" sx={{fontWeight: '550'}} >
                            {debt.to.name} 
                        </Typography>
                    }
                    secondary={
                        <>
                            <Typography
                            sx={{ display: 'inline-block' }}
                            component="span"
                            variant="caption"
                            color="red"
                            >
                            you owe&nbsp;
                            </Typography>
                            
                                <Typography
                                sx={{ display: 'inline-block' }}
                                component="span"
                                variant="body"
                                color="red"
                                >
                                {debt.amount} 
                                </Typography>
                                <Typography
                                sx={{ display: 'inline-block' }}
                                component="span"
                                variant="caption"
                                color="red"
                                >
                                &nbsp;{debt.group ? "in " + debt.group.name : ""}
                                </Typography>
                            </>
                            
                        
                    } />
                    
                </ListItem>
              
            ))}
            </List>
          </Grid>
          <Grid item xs={12} sx={{ display: {xs: 'block', md: 'none'}}} >
            <Divider />
          </Grid>
          <Grid item xs={12} md={6} sx={{ borderLeft: {md:'1px solid #ccc'}, paddingLeft: 2 }}>
            <Typography variant="h5"  sx={{fontWeight: '600', color: 'grey'}} >You get back</Typography>
            <List>
            {getBacks.map((debt, index) => (
                <ListItem alignItems="flex-start" key={index}>
                    <ListItemAvatar>
                        <Avatar alt={debt.from.name} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                    sx={{
                        '.MuiListItemText-secondary':{
                                position: "absolute",
                                bottom:10
                        }
                    }}
                    primary={
                        <Typography variant="" sx={{fontWeight: '550'}} >
                            {debt.from.name} 
                        </Typography>
                    }
                    secondary={
                        <>
                        <Typography
                        sx={{ display: 'inline-block' }}
                        component="span"
                        variant="caption"
                        color="green"
                        >
                        owes you&nbsp;
                        </Typography>
                        
                            <Typography
                            sx={{ display: 'inline-block' }}
                            component="span"
                            variant="body"
                            color="green"
                            >
                            {debt.amount} 
                            </Typography>
                            <Typography
                            sx={{ display: 'inline-block' }}
                            component="span"
                            variant="caption"
                            color="green"
                            >
                            &nbsp;{debt.group ? "in " + debt.group.name : ""}
                            </Typography>
                        </>
                        
                    } />
                </ListItem>
            ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
    )

    return (
        <Box>
            
            {debts? <>{debtsTable}</> : <Typography>No Debts</Typography>}
                

            

        </Box>
    )
}

export default Debts;