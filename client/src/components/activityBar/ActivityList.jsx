import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';
import getActivityUtil from '../../utils/activity.utils';
import { useContext } from 'react';
import UserContext from '../../../context/userContext';
import axios from 'axios';
import fetchExpenses from '../../utils/activity.utils';
import { Box, Divider } from '@mui/material';




export default function ActivityList() {

    const {user} = useContext(UserContext);
    console.log(user);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchExpenses(setExpenses);
      }, []);
    console.log(expenses);

    const myActivity = (
        <Box sx={{ height: '100%', overflowY: 'scroll', width: '100%', bgcolor: 'background.paper' }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {expenses.map((expense, index)=>(
                <ListItem alignItems="flex-start" key={expense.createdAt}>
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary={expense.description}
                    secondary={<React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {expense.paidBy.email == user.email ? "You " : expense.paidBy.name+" "}
                             paid {expense.amount}
                        </Typography>
                        <br />
                        {expense.paidBy.email == user.email ? "You get back "+ (expense.amount - expense.yourShare) : "You owe "+expense.yourShare }
                        
                    </React.Fragment>} />
            </ListItem>

            ))}
        
        </List>    
        </Box>
    )
    const noActivity = (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start">
            <ListItemText
                primary="No Activity!"
                ></ListItemText>
                
        </ListItem>
        <Divider component="li" />
        </List>    
    )
    
    return (
        <>
        {expenses.length > 0 ? <> {myActivity} </> : <> {noActivity} </>}
        </>
    );
}
