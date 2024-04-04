import { List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

const SelectSplitType = ({ props }) => {
  const allSplitTypes = ["EQUAL", "UNEQUAL", "PERCENTAGE", "SHARE"];

  const setExpenseFormData = props.setExpenseFormData;
  const expenseFormData = props.expenseFormData;

  const handleClose = props.handleClose;

  const [selectedItem, setSelectedItem] = React.useState(expenseFormData.splitType);

  const handleSplitTypeUpdate = (splitType) => {
    setSelectedItem(splitType);
    setExpenseFormData({...expenseFormData,splitType:splitType});
    handleClose();
  };

  return (
    <>
      <List sx={{ border: "1px solid black", py: 0, borderRadius: "5px", width:'50%' }}>
        {allSplitTypes.map((splitType, index) => (
          <ListItem sx={{
            cursor: "pointer",
            borderBottom: "1px solid grey",
            backgroundColor:
              selectedItem === splitType ? "lightgray" : "inherit", // Highlight selected item
          }}
          key={index}
          onClick={() => handleSplitTypeUpdate(splitType)}>
            <ListItemText primary={(<Typography sx={{fontWeight: selectedItem === splitType ? 'bold' : ""  }}>{splitType}</Typography>)} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SelectSplitType;
