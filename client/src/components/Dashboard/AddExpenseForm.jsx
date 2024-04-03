import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import SearchParticipants from "./AddExpense/searchParticipants";
import NestedModalForm from "./AddExpense/NestedModalForm";
import fetchAllGroups from "../../utils/getAllGroups.util";
import fetchAllUsers from "../../utils/getAllUsers.utli";
import createExpense from "../../utils/addExpense.util";
import { useLocation, useNavigate } from "react-router-dom";

function ChildModal({ props }) {
  const [childTransition, setChildTransition] = React.useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: { md: "50%", xs: "0%" },
    transform: "translate(-50%, -50%)",
    width: { md: "40%", xs: "90%" },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    transition: "left 2s",
    overflow: "hidden",
  };

  const openStyle = {
    ...style,
    // backgroundColor:'red',
    left: { md: "75%", xs: "50%" },
  };

  const formType = props.name;

  const handleTransition = props.handleTransition;
  const transition = props.transition;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    handleTransition();
  };
  const handleClose = () => {
    handleTransition();
    setOpen(false);
    handleChildTransition();
  };

  const handleChildTransition = () => {
    setChildTransition(!childTransition);
  };
  const containerRef = React.useRef(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  };

  return (
    <React.Fragment>
      <Button
        sx={{ mx: 2, textAlign: "center" }}
        variant="contained"
        onClick={handleOpen}
      >
        {formType === "Group" && props.expenseFormData.group !== null
          ? props.expenseFormData.group.name
          : formType === "PaidBy" &&
            props.expenseFormData.paidBy.name !== props.user.name
          ? props.expenseFormData.paidBy.name
          : formType === "Date"
          ? formatDate(props.expenseFormData.expenseDate)
          : formType === "Split Type"
          ? props.expenseFormData.splitType
          : props.display}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Fade
          in={open}
          timeout={1000}
          direction="right"
          container={containerRef.current}
        >
          <Box sx={openStyle}>
            <h2 id="child-modal-title">{formType}</h2>
            <NestedModalForm props={{ ...props, handleClose }} />
            <Button onClick={handleClose}>Close Child Modal</Button>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
}

export default function AddExpenseForm({ props }) {
  const user = props.user;
  const setDataUpdated = props.setDataUpdated;
  const dataUpdated = props.dataUpdated;

  const [allUsers, setAllUsers] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState([]);

  const currDate = Date.now();

  const expenseFormDataState = {
    description: "",
    amount: "",
    paidBy: user,
    participants: [],
    splitType: "EQUAL",
    splitShares: [],
    expenseDate: currDate,
    group: null,
  };
  const [expenseFormData, setExpenseFormData] = React.useState({});

  React.useEffect(() => {
    fetchAllGroups(setAllGroups);
    fetchAllUsers(setAllUsers);
    setExpenseFormData(expenseFormDataState);
  }, [user]);

  const [open, setOpen] = React.useState(false);
  const [transition, setTransition] = React.useState(false);

  const handleTransition = () => {
    setTransition(!transition);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: transition ? { md: "25%", xs: "50%" } : "50%",
    transform: "translate(-50%, -50%)",
    width: { md: "40%", xs: "90%" },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    transition: { md: "left 2s!important" },
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addExpense = async (event) => {
    event.preventDefault();
    handleClose();
    await createExpense(expenseFormData);

    setExpenseFormData(expenseFormDataState);

    props.setDataUpdated(Date.now());
  };

  return (
    <Box sx={{ display: "inline" }}>
      <Button
        variant="contained"
        color="error"
        onClick={handleOpen}
        sx={{
          ml: 2,
          my: 1,
        }}
        size="small"
      >
        Add Split?
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
            <Box component="form" onSubmit={addExpense} sx={{ mt: 1 }}>
              <SearchParticipants
                props={{
                  allUsers: allUsers,
                  user: user,
                  setExpenseFormData: setExpenseFormData,
                  expenseFormData: expenseFormData,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                type="text"
                onChange={(e) =>
                  setExpenseFormData({
                    ...expenseFormData,
                    description: e.target.value,
                  })
                }
                value={expenseFormData.description}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="amount"
                label="Amount"
                name="amount"
                type="number"
                inputProps={{ min: 1 }}
                onChange={(e) =>
                  setExpenseFormData({
                    ...expenseFormData,
                    amount: parseFloat(e.target.value),
                  })
                }
                value={expenseFormData.amount}
              />
              <ChildModal
                props={{
                  name: "PaidBy",
                  allGroups: allGroups,
                  handleTransition: handleTransition,
                  transition: transition,
                  expenseFormData: expenseFormData,
                  setExpenseFormData: setExpenseFormData,
                  display: user.name,
                  user: user,
                }}
              />
              <ChildModal
                props={{
                  name: "Group",
                  allGroups: allGroups,
                  handleTransition: handleTransition,
                  transition: transition,
                  expenseFormData: expenseFormData,
                  setExpenseFormData: setExpenseFormData,
                  display: "No Group Selected",
                  user: user,
                }}
              />
              <ChildModal
                props={{
                  name: "Date",
                  handleTransition: handleTransition,
                  transition: transition,
                  expenseFormData: expenseFormData,
                  setExpenseFormData: setExpenseFormData,
                  display: "Select Date",
                  user: user,
                }}
              />
              <ChildModal
                props={{
                  name: "Split Type",
                  handleTransition: handleTransition,
                  transition: transition,
                  expenseFormData: expenseFormData,
                  setExpenseFormData: setExpenseFormData,
                  display: "EQUAL",
                  user: user,
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Expense
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
