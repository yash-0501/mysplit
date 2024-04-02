import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ActivityList({ props }) {
  console.log(props);
  const user = props.user;
  const expenses = props.expenses;
  console.log(expenses);

  const myActivity = (
    <List sx={{ width: "100%" }}>
      {expenses.map((expense, index) => (
        <Link
          to={`expenses/${expense._id}`}
          key={expense._id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar
                sx={{ width: "50px", height: "50px" }}
                alt={expense.paidBy.name}
                src="/static/images/avatar/1.jpg"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 570 }}>
                  {expense.description}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {expense.paidBy.email == user.email
                      ? "You "
                      : expense.paidBy.name + " "}
                    paid {expense.amount}
                  </Typography>
                  <br />
                  {expense.paidBy.email == user.email
                    ? "You get back " + (expense.amount - expense.yourShare)
                    : "You owe " + expense.yourShare}
                </React.Fragment>
              }
            />
          </ListItem>
        </Link>
      ))}
    </List>
  );
  const noActivity = (
    <Box
      sx={{
        height: "calc(100% - 50px)",
        py: "20px",
        mx: "5%",
      }}
    >
      <Typography variant="h4">No Activty!</Typography>
      <Divider />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "calc(100% - 50px)",
          alignItems: "center",
          mx: "5%",
        }}
      >
        <Button variant="contained" color="success" size="large" disableRipple>
          How About you Add Expenses?
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        scrollBehavior: "smooth",
        width: "100%",
        bgcolor: "background.paper",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          backgroundColor: "#f0f0f0",
          borderRadius: "2px",
          height: "50px",
          textAlign: "center",
          display: "flex",
          alignItems: "center", // Vertically center the content
          justifyContent: "center", // Horizontally center the content
          position: "sticky",
          top: 0,
          zIndex: 1, // Ensure it appears above other content
        }}
      >
        <Typography>Your Activity</Typography>
      </Paper>

      {expenses.length > 0 ? <> {myActivity} </> : <> {noActivity} </>}
    </Box>
  );
}
