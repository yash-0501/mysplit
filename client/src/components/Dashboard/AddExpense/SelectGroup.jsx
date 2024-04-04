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
  console.log(name.split(" "));
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

const SelectGroup = ({ props }) => {

  const setExpenseFormData = props.setExpenseFormData;
  const expenseFormData = props.expenseFormData;
  const handleClose = props.handleClose;

  const [selectedItem, setSelectedItem] = useState(expenseFormData.group);

  const allGroups = props.allGroups;
  

  const handleGroupUpdate = (group) => {
    setSelectedItem(group);
    setExpenseFormData({...expenseFormData,group:group});
    handleClose();
  };

  return (
    <>
      <List sx={{ border: "1px solid black", py: 0, borderRadius: "5px" }}>
        <ListItem
          sx={{
            cursor: "pointer",
            borderBottom: "1px solid grey",
            backgroundColor: selectedItem === null ? "lightgray" : "inherit",
          }}
          onClick={() => handleGroupUpdate(null)}
        >
          <ListItemText
            primary={
              <Typography sx={{fontWeight: selectedItem == null ? 'bold' : ""  }}>Non Group Expense</Typography>
            }
          />
        </ListItem>
        {allGroups.length > 0 &&
          allGroups.map((group, index) => (
            <ListItem
              sx={{
                cursor: "pointer",
                borderBottom: "1px solid grey",
                backgroundColor:
                  selectedItem === group ? "lightgray" : "inherit",
              }}
              key={index}
              onClick={() => handleGroupUpdate(group)}
            >
              <ListItemAvatar>
                <Avatar {...stringAvatar(group.name)}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={(<Typography sx={{fontWeight: selectedItem === group ? 'bold' : ""  }}>{group.name}</Typography>)} />
            </ListItem>
          ))}
      </List>
    </>
  );
};

export default SelectGroup;
