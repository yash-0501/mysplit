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
import SearchParticipants from "./AddExpense/searchParticipants";
import NestedModalForm from "./AddExpense/NestedModalForm";
import fetchAllGroups from "../../utils/getAllGroups.util";
import fetchAllUsers from "../../utils/getAllUsers.utli";
import createExpense from "../../utils/addExpense.util";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

function ChildModal({ props }) {
  const [childTransition, setChildTransition] = React.useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: { md: "50%", xs: "0%" },
    transform: "translate(-50%, -50%)",
    width: { md: "40%", xs: "90%" },
    height: "75vh",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    transition: "left 2s",
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

  const toDisplayChip =
    formType === "Group" && props.expenseFormData.group !== null
      ? props.expenseFormData.group.name
      : formType === "PaidBy" &&
        props.expenseFormData.paidBy.name !== props.user.name
      ? props.expenseFormData.paidBy.name
      : formType === "Date"
      ? formatDate(props.expenseFormData.expenseDate)
      : formType === "Split Type"
      ? props.expenseFormData.splitType
      : props.display;

  return (
    <React.Fragment>
      <Chip
        color="info"
        label={toDisplayChip}
        onClick={handleOpen}
        size="small"
        sx={{
          width: formType === "Group" ? "50%" : "fit-content",
          mx: 1,
          textAlign: "center",
          p: 1,
        }}
      />
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
    amount: 0,
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
  const [transition, setTransition] = React.useState(true);
  const [loader, setLoader] = React.useState(false);

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

  const handleOpen = () => {
    setOpen(true);
    setExpenseFormData(expenseFormDataState);
    handleTransition();
  };
  const handleClose = () => {
    setOpen(false);
    handleTransition();
  };

  const validateExpenseData = (event) => {
    event.preventDefault();
    let messages = [];
    if (!expenseFormData.paidBy) {
      messages.push("Please select the expense paid by user.");
    }
    if (expenseFormData.participants.length < 2) {
      messages.push("Please select atleasst 2 participants");
    }
    if (
      expenseFormData.splitType !== "EQUAL" &&
      expenseFormData.participants.length !== expenseFormData.splitShares.length
    ) {
      messages.push("Please check your expense split");
    }
    if (messages.length > 0) {
      for (const msg of messages) {
        toast.error(msg);
      }
    } else {
      handleClose();
      addExpense();
    }
  };

  const showLoader = () => {
    setLoader(!loader);
  };

  const addExpense = async () => {
    console.log(expenseFormData);
    showLoader();
    await createExpense(expenseFormData);
    showLoader();
    setExpenseFormData(expenseFormDataState);

    props.setDataUpdated(Date.now());
  };
  if (loader) return <Loader />;
  else {
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
              <Box
                component="form"
                onSubmit={validateExpenseData}
                sx={{ mt: 1 }}
              >
                <SearchParticipants
                  props={{
                    allUsers: allUsers,
                    user: user,
                    setExpenseFormData: setExpenseFormData,
                    expenseFormData: expenseFormData,
                  }}
                />
                {!expenseFormData.participants ||
                expenseFormData?.participants.length < 2 ? (
                  <></>
                ) : (
                  <>
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
                    <Box
                      display={"flex"}
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        justifyContent: "center",
                        my: 1.5,
                      }}
                    >
                      <Typography>Paid by</Typography>
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
                      <Typography>and split</Typography>
                      <ChildModal
                        props={{
                          name: "Split Type",
                          handleTransition: handleTransition,
                          transition: transition,
                          expenseFormData: expenseFormData,
                          setExpenseFormData: setExpenseFormData,
                          display: "Equally",
                          user: user,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        my: 1.5,
                      }}
                    >
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
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        my: 1.5,
                      }}
                    >
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
                    </Box>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Add Expense
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    );
  }
}
