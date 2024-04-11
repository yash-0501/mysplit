import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react";

const SearchUsers = ({props}) => {

    const users = props.allUsers;
    const setFriend = props.setFriend;
    const friend = props.friend;
    
    return (
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={users}
      getOptionLabel={(option) => option.name}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Add a Friend" />}
      
      onChange={(event, newValue) => {
        setFriend(newValue);
      }}
    />
    )
}

export default SearchUsers;