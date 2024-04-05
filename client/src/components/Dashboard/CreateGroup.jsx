import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
} from "@mui/material";

import fetchAllGroups from "../../utils/getAllGroups.util";
import fetchAllUsers from "../../utils/getAllUsers.utli";

import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import SearchFriends from "./AddGroup/SearchFriends";
import createGroup from "../../utils/createGroup.util";

export default function CreateGroup({ props }) {
  const user = props.user;

  const groupFormDataState = {
    name: "",
    groupMembers: [],
  };
  const [groupFormData, setGroupFormData] = React.useState(groupFormDataState);

  const [open, setOpen] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);

  React.useState(() => {
    fetchAllUsers(setAllUsers);
  }, []);

  const handleTransition = () => {
    setTransition(!transition);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { md: "40%", xs: "90%" },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = () => {
    setOpen(true);
    setGroupFormData(GroupFormDataState);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateGroup = async(event) => {
    event.preventDefault();
    // console.log(groupFormData, "Helooooo");
    showLoader();
    await createGroup(groupFormData);
    showLoader();
    handleClose();
    setGroupFormData(groupFormDataState);
    props.setDataUpdated(Date.now());
  };

  const showLoader = () => {
    setLoader(!loader);
  };

  if (loader) return <Loader />;
  else {
    return (
      <Box sx={{ display: "inline" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={handleOpen}
          sx={{
            ml: 2,
            my: 1,
          }}
          size="small"
        >
          Split Squad?
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade timeout={1000} in={open}>
            <Box sx={{ ...style }}>
              <Box
                component="form"
                onSubmit={handleCreateGroup}
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Group Name"
                      name="name"
                      type="text"
                      onChange={(e) =>
                        setGroupFormData({
                          ...groupFormData,
                          name: e.target.value,
                        })
                      }
                      value={groupFormData.name}
                      sx={{
                        m:2
                      }}
                    />
                <SearchFriends
                  props={{
                    allUsers: allUsers,
                    user: user,
                    setGroupFormData: setGroupFormData,
                    groupFormData: groupFormData,
                  }}
                />
                <Button
                type="submit"
                  variant="contained"
                  color="success"
                  sx={{ mt: 3, mb: 2 }}
                  fullWidth
                >
                  Create Group
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    );
  }
}
