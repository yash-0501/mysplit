import {
  Avatar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const Debts = ({ props }) => {
  const Nothing = (props) => (
    <ListItem key={props}>
      <ListItemText
        primary="Hey! You've got nothing"
        secondary="How about you add some expense!"
      ></ListItemText>
    </ListItem>
  );

  const debts = props.debts;

  let owes = [],
    getBacks = [];

  if (debts) {
    owes = debts?.owes;
    getBacks = debts?.getBacks;
  }

  const debtsTable = (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" sx={{ fontWeight: "600", color: "grey" }}>
          You Owe
        </Typography>
        <List>
          {owes.length > 0 ? (
            owes.map((debt, index) => (
              <ListItem
                alignItems="flex-start"
                key={debt.to.name + "#" + index}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={debt.to.name}
                    src="/static/images/avatar/1.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    ".MuiListItemText-secondary": {
                      position: "absolute",
                      bottom: 10,
                    },
                  }}
                  primary={
                    <Typography variant="" sx={{ fontWeight: "550" }}>
                      {debt.to.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline-block" }}
                        component="span"
                        variant="caption"
                        color="red"
                      >
                        you owe&nbsp;
                      </Typography>

                      <Typography
                        sx={{ display: "inline-block" }}
                        component="span"
                        variant="body"
                        color="red"
                      >
                        {debt.amount}
                      </Typography>
                      <Typography
                        sx={{ display: "inline-block" }}
                        component="span"
                        variant="caption"
                        color="red"
                      >
                        &nbsp;{debt.group ? "in " + debt.group.name : ""}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Nothing props={"owes"} />
          )}
        </List>
      </Grid>
      <Grid item xs={12} sx={{ display: { xs: "block", md: "none" } }}>
        <Divider />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ borderLeft: { md: "1px solid #ccc" }, paddingLeft: 2 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "600", color: "grey" }}>
          You get back
        </Typography>
        <List>
          {getBacks.length > 0 ? (
            getBacks.map((debt, index) => (
              <ListItem
                alignItems="flex-start"
                key={debt.from.name + "*" + index}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={debt.from.name}
                    src="/static/images/avatar/1.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    ".MuiListItemText-secondary": {
                      position: "absolute",
                      bottom: 10,
                    },
                  }}
                  primary={
                    <Typography variant="" sx={{ fontWeight: "550" }}>
                      {debt.from.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline-block" }}
                        component="span"
                        variant="caption"
                        color="green"
                      >
                        owes you&nbsp;
                      </Typography>

                      <Typography
                        sx={{ display: "inline-block" }}
                        component="span"
                        variant="body"
                        color="green"
                      >
                        {debt.amount}
                      </Typography>
                      <Typography
                        sx={{ display: "inline-block" }}
                        component="span"
                        variant="caption"
                        color="green"
                      >
                        &nbsp;{debt.group ? "in " + debt.group.name : ""}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Nothing props={"getBacks"} />
          )}
        </List>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ overflowY: "auto" }}>
      {debts ? <>{debtsTable}</> : <Typography>No Debts</Typography>}
    </Box>
  );
};

export default Debts;
