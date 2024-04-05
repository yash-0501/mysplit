import * as React from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SearchFriends({ props }) {
  const participants = props.allUsers;
  const currUser = props.user;
  const setGroupFormData = props.setGroupFormData;
  const groupFormData = props.groupFormData;

  const fixedOptions = [participants[0]];
  const [value, setValue] = React.useState([...fixedOptions]);

  return (
    <Autocomplete
    sx={{
      width:'100%',
    }}
      multiple
      limitTags={2}
      id="fixed-tags-demo"
      value={value}
      onChange={(event, newValue) => {
        setValue([
          ...fixedOptions,
          ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
        ]);
        setGroupFormData({ ...groupFormData, groupMembers: [...newValue] });
      }}
      options={participants}
      getOptionLabel={(option) => option.name}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.name}
            {...getTagProps({ index })}
            disabled={fixedOptions.indexOf(option) !== -1}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          required={value.length < 2}
          {...params}
          label="Add To Your Squad"
          placeholder="Favorites"
        />
      )}
    />
  );
}
