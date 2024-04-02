import { Box, Button, Modal } from "@mui/material";
import React from "react";
import SelectGroup from "./SelectGroup";
import ExpenseDateTimePicker from "./ExpenseDateTimePicker";
import SelectExpenseType from "./SelectExpenseType";
import SelectPaidBy from "./SelectPaidBy";

const NestedModalForm = ({ props }) => {
  const formType = props.name;

  switch (formType) {
    case "PaidBy":
      return <SelectPaidBy props={props} />;
    case "Group":
      return <SelectGroup props={props} />;
    case "Date":
      return <ExpenseDateTimePicker />;
    default:
      return <SelectExpenseType />;
  }
};

export default NestedModalForm;
