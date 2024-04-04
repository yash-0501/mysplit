import { Box, Grid, Paper, Typography } from "@mui/material";

const BalanceSummary = ({ props }) => {
  const balanceDetails = props;

  let balColor = "green";
  if (balanceDetails.totalBalance < 0) balColor = "red";

  return (
    <Paper
      elevation={6}
      sx={{
        backgroundColor: "lightgrey",
        borderRadius: "0px",
        border: "1px solid grey",
        borderBottom: "1px solid grey",
        mb: 1,
        p: { md: 2 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography>
            {" "}
            Total Balance
            <Typography color={balColor} fontWeight={"bold"}>
              {balanceDetails.totalBalance > 0
                ? " + " + balanceDetails.totalBalance
                : " - " + -balanceDetails.totalBalance}
            </Typography>
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ textAlign: "center", borderLeft: "1px solid black" }}
        >
          <Typography>
            Your Total Share
            <Typography color={"black"} fontWeight={"bold"}>
              {balanceDetails.totalShare}
            </Typography>
          </Typography>
        </Grid>

        <Grid
          item
          xs={4}
          sx={{ textAlign: "center", borderLeft: "1px solid black" }}
        >
          <Typography>
            {" "}
            Total You Paid For
            <Typography color={"red"} fontWeight={"bold"}>
              {balanceDetails.totalPaidFor}
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BalanceSummary;
