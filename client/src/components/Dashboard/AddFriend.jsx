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

import fetchAllUsers from "../../utils/getAllUsers.utli";

import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import SearchUsers from "./AddFriend/SearchUsers";
import addFriend from "../../utils/addFriend.util";


export default function AddFriend({ props }) {
  const user = props.user;

  const [friend, setFriend] = React.useState(null);

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
    setFriend(null);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateGroup = async(event) => {
    event.preventDefault();
    console.log(friend, "Helooooo");
    showLoader();
    await addFriend(friend);
    showLoader();
    handleClose();
    setFriend(null);
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
          color="primary"
          onClick={handleOpen}
          sx={{
            ml: 2,
            my: 1,
          }}
          size="small"
        >
          Add Friend?
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
                <SearchUsers
                  props={{
                    allUsers: allUsers,
                    user: user,
                    setFriend: setFriend,
                    friend: friend,
                  }}
                />
                <Button
                type="submit"
                  variant="contained"
                  color="success"
                  sx={{ mt: 3, mb: 2 }}
                  fullWidth
                >
                  Add as a friend
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    );
  }
}
