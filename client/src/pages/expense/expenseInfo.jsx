import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Typography,
  Paper,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Container,
  List,
  Divider,
} from "@mui/material";
import Header from "../../components/header/header";
import UserContext from "../../../context/userContext";

const ExpenseInfo = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await axios.get(`/expenses/${id}`);
        setExpense(response.data);
      } catch (error) {
        console.error("Error fetching expense details:", error);
      }
    };

    fetchExpenseDetails();
  }, [id]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    // Define options for date formatting
    const options = {
      day: "numeric", // Day of the month, numerical representation
      month: "long", // Month name, full representation
      year: "numeric", // Year, numerical representation
    };

    // Format the date using specified options
    const formattedDate = date.toLocaleString("en-US", options);

    // Modify the formatted date to add 'th', 'st', 'nd', 'rd' suffix
    const day = date.getDate();
    const suffix =
      day >= 11 && day <= 13
        ? "th"
        : day % 10 === 1
        ? "st"
        : day % 10 === 2
        ? "nd"
        : day % 10 === 3
        ? "rd"
        : "th";

    // Replace the day in the formatted date with day + suffix
    return formattedDate.replace(`${day}`, `${day}${suffix}`);
  };

  const getAvatarInitial = (text) => {
    return text.charAt(0).toUpperCase();
  };

  const DisplayGroup = ({ props }) => {
    const name = props;
    return (
      <Paper
        elevation={10}
        sx={{
          backgroundColor: "#f0f0f0",
          borderRadius: "2px",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"start"}
          alignItems={"center"}
          p={0.5}
        >
          {name !== "Participants" ? (
            <Avatar
              variant="square"
              sx={{ width: 55, height: 55 }}
              alt={name}
              src={name}
            >
              {getAvatarInitial(name)}
            </Avatar>
          ) : (
            ""
          )}

          <Typography
            mx={2}
            variant="body1"
            sx={{
              fontWeight: "550",
              fontSize: "1.2em",
            }}
          >
            {name}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <>
      <Header props={{ user }} />
      <Container>
        {expense && (
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    variant="square"
                    sx={{ width: 70, height: 70 }}
                    alt={expense.description}
                    src={expense.description}
                  >
                    {getAvatarInitial(expense.description)}
                  </Avatar>
                  <Box
                    sx={{
                      ".MuiTypography-body1": { m: "0" },
                    }}
                    mx={2}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"start"}
                    alignItems={"start"}
                  >
                    <Typography mb={0} variant="body1">
                      {expense.description}
                    </Typography>
                    <Typography
                      my={0}
                      variant="body1"
                      sx={{
                        fontWeight: 550,
                        fontSize: "1.25em",
                      }}
                    >
                      {expense.amount}
                    </Typography>
                    <Typography my={0} variant="caption">
                      {" "}
                      Added by <strong>{expense.createdBy.name}</strong> on{" "}
                      {formatDate(expense.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={expense.paidBy.name}
                      src={expense.paidBy.avatar}
                    >
                      {getAvatarInitial(expense.paidBy.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${expense.paidBy.name}`}
                    secondary={
                      <>
                        Paid on <b>{formatDate(expense.expenseDate)}</b>
                      </>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "start",
                    flexDirection: "column",
                  }}
                >
                  <Paper elevation={4}>
                    {expense.group ? (
                      <DisplayGroup props={expense.group.name} />
                    ) : (
                      <DisplayGroup props={"Participants"} />
                    )}

                    <List
                      sx={{
                        ".MuiListItem-root": { p: "0" },
                        maxHeight: "120px",
                        overflowY: "auto",
                        p: 2,
                      }}
                    >
                      {expense.participants.map((pData, index) => (
                        <Box key={index}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar
                                alt={pData.participant.name}
                                src={pData.participant.avatar}
                              >
                                {getAvatarInitial(pData.participant.name)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${pData.participant.name}`}
                              secondary={
                                <Typography variant="body2">
                                  owes <strong>{pData.share}</strong>
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider variant="middle" />
                        </Box>
                      ))}
                    </List>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default ExpenseInfo;
