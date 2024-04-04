import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  name = name.toUpperCase();
  let flag = true;

  if (name.split(" ").length < 2) flag = false;
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: flag
      ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
      : `${name[0]}`,
  };
}

const SelectPaidBy = ({ props }) => {
  const setExpenseFormData = props.setExpenseFormData;
  const expenseFormData = props.expenseFormData;

  const [selectedItem, setSelectedItem] = useState(expenseFormData.paidBy);

  const allParticipants = props.expenseFormData.participants;

  const handleClose = props.handleClose;

  const handlePaidByUpdate = (participant) => {
    if (participant === null) alert("No participant selected!");
    setSelectedItem(participant);
    setExpenseFormData({ ...expenseFormData, paidBy: participant });
    handleClose();
  };

  return (
    <>
      <List sx={{ border: "1px solid black", py: 0, borderRadius: "5px" }}>
        {allParticipants.length > 0 &&
          allParticipants.map((participant, index) => (
            <ListItem
              sx={{
                cursor: "pointer",
                borderBottom: "1px solid grey",
                backgroundColor:
                  selectedItem._id === participant._id ? "lightgray" : "inherit", // Highlight selected item
              }}
              key={index}
              onClick={() => handlePaidByUpdate(participant)}
            >
              <ListItemAvatar>
                <Avatar {...stringAvatar(participant.name)}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={(<Typography sx={{fontWeight: selectedItem._id === participant._id ? 'bold' : ""  }}>{participant.name}</Typography>)} />
            </ListItem>
          ))}
      </List>
    </>
  );
};

export default SelectPaidBy;
