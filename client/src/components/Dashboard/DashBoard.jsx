import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import Debts from "./Debts";
import BalanceSummary from "./BalanceSummary";
import AddExpenseForm from "./AddExpenseForm";
import { Link } from "react-router-dom";
import CreateGroup from "./CreateGroup";

const Dashboard = ({ props }) => {
  const user = props.user;
  const balance = props.balance;
  const balanceDetails = props.balanceDetails;

  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          md: "75%",
        },
        display: "flex",
        flexDirection: "column",
        padding: { md: "5px", xs: "7.5px" },
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: "lightgrey",
            borderRadius: "0px",
            border: "1px solid grey",
            borderBottom: "1px solid grey",
            px: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              py: 1,
            }}
          >
            <Typography
              variant="h5"
              fontSize={"2.25em"}
              color={"primary"}
              fontWeight={"800"}
              textAlign={"center"}
            >
              DashBoard
            </Typography>
            <Divider variant="middle" />
          </Box>

          <Box
            sx={{
              ".MuiButton-root": { textTransform: "capitalize" },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {!!user && (
              <Typography variant="h6">
                Hey, <i>{user.name}!</i>
              </Typography>
            )}
            <Box>
              <AddExpenseForm
                props={{
                  user: user,
                  setDataUpdated: props.setDataUpdated,
                  dataUpdated: props.dataUpdated,
                }}
              />
              <Button
                variant="contained"
                color="success"
                component={Link}
                to="/settle"
                sx={{
                  ml: 2,
                  my: 1,
                }}
                size="small"
              >
                Settle Now?
              </Button>
              <CreateGroup
                props={{ user: user, setDataUpdated: props.setDataUpdated }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>

      {!!user && !!balanceDetails && <BalanceSummary props={balanceDetails} />}
      <Debts props={balance} />
    </Box>
  );
};

export default Dashboard;
