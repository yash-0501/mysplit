import { List, ListItem, ListItemText } from "@mui/material";
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
      <List>
        {allSplitTypes.map((splitType, index) => (
          <ListItem sx={{
            cursor: "pointer",
            borderBottom: "1px solid grey",
            backgroundColor:
              selectedItem === splitType ? "lightgray" : "inherit", // Highlight selected item
          }}
          key={index}
          onClick={() => handleSplitTypeUpdate(splitType)}>
            <ListItemText primary={splitType} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SelectSplitType;
