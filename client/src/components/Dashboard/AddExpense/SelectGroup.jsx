import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useState } from "react";

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
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
    console.log(name.split(' '))
    if(name.split(' ').length<2)
        flag = false;
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: flag?`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`:`${name[0]}`,
    };
}

const SelectGroup = ({props}) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const allGroups = props.allGroups;
    console.log(allGroups)

    const handleGroupUpdate = (group) => {
        if(group === null)
            alert("No group expense!")
        setSelectedItem(group);
        alert(group.name);
    }

    return (
        <>
            <List sx={{border:'1px solid black', py:0, borderRadius:'5px'}}>
                <ListItem sx={{
                            cursor: 'pointer',
                            borderBottom: '1px solid grey',
                            backgroundColor: selectedItem === null ? 'lightgray' : 'inherit', // Highlight selected item
                        }} 
                        onClick={() => handleGroupUpdate(null)}    
                    >
                    <ListItemText primary={(
                        <Typography fontWeight={'bold'}>
                            Non Group Expense
                        </Typography>
                    )}/>
                </ListItem>
                {allGroups.length > 0 && allGroups.map((group,index)=>(
                    <ListItem 
                        sx={{
                            cursor: 'pointer',
                            borderBottom: '1px solid grey',
                            backgroundColor: selectedItem === group ? 'lightgray' : 'inherit', // Highlight selected item
                        }} 
                        key={index} 
                        onClick={() => handleGroupUpdate(group)}
                    >
                        <ListItemAvatar>
                            <Avatar {...stringAvatar(group.name)}></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={group.name} />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default SelectGroup;
