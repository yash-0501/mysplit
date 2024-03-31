import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Paper, Avatar, ListItem, ListItemAvatar, ListItemText, Box, Container } from '@mui/material';
import Header from '../../components/header/header';

const ExpenseInfo = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await axios.get(`/expenses/${id}`);
        setExpense(response.data);
      } catch (error) {
        console.error('Error fetching expense details:', error);
      }
    };

    fetchExpenseDetails();
  }, [id]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    // Define options for date formatting
  const options = {
    day: 'numeric', // Day of the month, numerical representation
    month: 'long', // Month name, full representation
    year: 'numeric', // Year, numerical representation
  };

  // Format the date using specified options
  const formattedDate = date.toLocaleDateString('en-US', options);
  
  // Modify the formatted date to add 'th', 'st', 'nd', 'rd' suffix
  const day = date.getDate();
  const suffix = (day >= 11 && day <= 13) ? 'th' :
                 (day % 10 === 1) ? 'st' :
                 (day % 10 === 2) ? 'nd' :
                 (day % 10 === 3) ? 'rd' : 'th';
  
  // Replace the day in the formatted date with day + suffix
  return formattedDate.replace(`${day}`, `${day}${suffix}`);
    
  };

  const getAvatarInitial = (text) => {
    return text.charAt(0).toUpperCase();
  };

  return (
    <>
    <Header />
    <Container>
      {expense && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" gutterBottom>Expense Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box sx={{
                    display:'flex',
                    justifyContent:'start',
                    alignItems:'center'
                }}>
                <Avatar variant='square' sx={{ width: 56, height: 56 }} alt={expense.description} src={expense.description}>{getAvatarInitial(expense.description)}</Avatar>
                <Box  mx={2} display={'flex'} flexDirection={'column'} justifyContent={'start'} alignItems={'start'}>
                    <Typography variant="body1">{expense.description}</Typography>
                    <Typography variant="body1" sx={{
                        fontWeight: 550,
                        fontSize: '1.5em'
                    }}>{expense.amount}</Typography>
                    <Typography variant="caption"> Added by <strong>{expense.createdBy.name}</strong> on {formatDate(expense.createdAt)}</Typography>
                </Box>
              
                </Box>
            
              <Typography variant="body1"><strong>Added By:</strong> 
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={expense.createdBy.name} src={expense.createdBy.avatar}>{getAvatarInitial(expense.createdBy.name)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${expense.createdBy.name}:`} />
                </ListItem>
              </Typography>
              <Typography variant="body1"><strong>Paid By:</strong>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={expense.paidBy.name} src={expense.paidBy.avatar}>{getAvatarInitial(expense.paidBy.name)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${expense.paidBy.name}:`} />
                </ListItem>
              </Typography>
              <Typography variant="body1"><strong>Amount:</strong> {expense.amount}</Typography>
              {!!expense.group && (
                <Typography variant="body1"><strong>Group:</strong> {expense.group.name}</Typography>
              )}
              <Typography variant="body1"><strong>Created At:</strong> {formatDate(expense.createdAt)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Participants:</strong></Typography>
              <ul>
                {expense.participants.map((pData, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar alt={pData.participant.name} src={pData.participant.avatar}>{getAvatarInitial(pData.participant.name)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${pData.participant.name}:`} secondary={`owes ${pData.share}`} />
                  </ListItem>
                ))}
              </ul>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
    </>
  );
};

export default ExpenseInfo;
