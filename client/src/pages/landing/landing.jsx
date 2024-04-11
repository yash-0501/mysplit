import { useContext, useEffect, useState } from "react";
import UseAuth from "../../hooks/useAuth";
import UserContext from "../../../context/userContext";
import Header from "../../components/header/header";
import ActivityBar from "../../components/activityBar/ActivityBar";
import { Box, Button, Container } from "@mui/material";
import fetchExpenses from "../../utils/activity.util";
import fetchBalance from "../../utils/balance.utl";
import fetchBalanceSummary from "../../utils/balanceSummary.util";
import Dashboard from "../../components/Dashboard/DashBoard";
import Loader from "../../components/Loader/Loader";
import getCurrUser from "../../utils/getCurrUser.util";

const LandingPage = () => {
  const { user, setUser } = useContext(UserContext);
  

  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState([]);
  const [balanceDetails, setBalanceDetails] = useState(null);

  const [dataUpdated, setDataUpdated] = useState("null");
  const [currUser, setCurrUser] = useState(null);

  const handleDataUpdate = (val) => {
    setDataUpdated(val);
  }

  useEffect(() => {
    
    setExpenses(null);
    setBalance(null);
    setBalanceDetails(null);
    let ignore = false;
    if (!ignore) {
      fetchExpenses(setExpenses);
      fetchBalance(setBalance);
      fetchBalanceSummary(setBalanceDetails);
      getCurrUser(setCurrUser);
      setUser(user);
    }

    return () => {
      ignore = true;
    };
  }, [dataUpdated]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexWrap: 1,
      }}
    >
      <Header props={{ user:currUser }} />
      <Container sx={{ height: "100%", overflowY: "auto" }}>
        {(balance!==null && expenses !== null && balanceDetails !==null)?(<Box sx={{ width: "100%", display: "flex", height: "100%" }}>
          <Dashboard
            props={{
              user: { ...currUser },
              balance,
              balanceDetails,
              setDataUpdated: handleDataUpdate,
              dataUpdated: dataUpdated,
            }}
          />
          <ActivityBar props={{ user: { ...currUser }, expenses }} />
        </Box>):<Loader />}
      </Container>
    </Box>
  );
};

export default LandingPage;
