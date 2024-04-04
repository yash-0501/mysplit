import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

const SelectSplitType = ({ props }) => {
  const allSplitTypes = ["EQUAL", "UNEQUAL", "PERCENTAGE", "SHARE"];

  const setExpenseFormData = props.setExpenseFormData;
  const expenseFormData = props.expenseFormData;

  const handleClose = props.handleClose;
  const participants = expenseFormData.participants;

  const [selectedItem, setSelectedItem] = React.useState(
    expenseFormData.splitType
  );

  const [error, setError] = React.useState(false);

  const validateAmount = (splitType) => {
    console.log(splitType)
    if(splitType === "EQUAL"){
      handleSplitTypeUpdate(splitType);
      handleClose();
      return;
    }
    const amt = expenseFormData.amount;
    console.log(amt);
    if (!amt || amt <= 0) {
      toast.error("Set Amount First to Continue!");
      return;
    } else {
      handleSplitTypeUpdate(splitType);
    }
  };

  const handleSplitTypeUpdate = (splitType) => {
    setSelectedItem(splitType);
    setExpenseFormData({
      ...expenseFormData,
      splitType: splitType,
    });
    setError(false);
  };

  const validateSplit = () => {
    const shares = expenseFormData.splitShares;
    const amt = expenseFormData.amount;
    if (shares.length !== expenseFormData.participants.length) {
      setError(true)
      toast.error("Invalid Split");
      return;
    } else {
      for (const share of shares) {
        if (!share) {
          setError(true)
          toast.error("Enter Split");
          return;
        }
      }
    }

    let flag = false;
    switch (expenseFormData.splitType) {
      case "UNEQUAL":
        flag = amt === shares.reduce((total, share) => (total = total + share));
        break;
      case "PERCENTAGE":
        flag = shares.reduce((total, share) => (total = total + share)) == 100;
        break;
      default:
        flag = true;
    }
    if (flag) {
      toast.success("Split Added");
      setError(false);
      handleClose();
    } else {
      setError(true);
      toast.error("Check split!");
    }
  };

  return (
    <Box sx={{ display: "flex", height:'70%', width:'100%', flexDirection:'row' }}>
      <List
        sx={{
          border: "1px solid black",
          py: 0,
          borderRadius: "5px",
          width: "50%",
          height:'fit-content'
        }}
      >
        {allSplitTypes.map((splitType, index) => (
          <ListItem
            sx={{
              cursor: "pointer",
              borderBottom: "1px solid grey",
              backgroundColor:
                selectedItem === splitType ? "lightgray" : "inherit", // Highlight selected item
            }}
            key={index}
            onClick={() => validateAmount(splitType)}
          >
            <ListItemText
              primary={
                <Typography
                  sx={{ fontWeight: selectedItem === splitType ? "bold" : "" }}
                >
                  {splitType}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      {expenseFormData.splitType !== "EQUAL" && (
        <Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            maxHeight: "70%",
            mx: 2,
            flexDirection: "column",
            alignItems: "space-between",
            justifyContent: "start",
            overflowY:'auto',
            border:'1px solid grey'
          }}
        >
          {participants.map((participant, index) => (
            <Box
              key={index}
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{ border: "1.5px solid black", px: 1 }}
            >
              <Typography>{participant.name}</Typography>
              <TextField
                error={error}
                size="small"
                margin="normal"
                required
                sx={{
                  mx: 2,
                  width: "45%",
                }}
                id="description"
                label={expenseFormData.splitType}
                name="description"
                type="number"
                onChange={(e) => {
                  let shares = [...expenseFormData.splitShares];
                  shares[index] = parseFloat(e.target.value);
                  setExpenseFormData({
                    ...expenseFormData,
                    splitShares: shares,
                  });
                }}
                value={expenseFormData.splitShares[index]}
              />
            </Box>
          ))}
          
        </Box>
        <Button
            size="small"
            variant="contained"
            sx={{ m: 2 }}
            onClick={validateSplit}
          >
            Add Split
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SelectSplitType;
