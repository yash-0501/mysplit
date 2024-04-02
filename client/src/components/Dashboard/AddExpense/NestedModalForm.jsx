import { Box, Button, Modal } from "@mui/material";
import React from "react";
import SelectGroup from "./SelectGroup";
import ExpenseDateTimePicker from "./ExpenseDateTimePicker";
import SelectExpenseType from "./SelectExpenseType";

const NestedModalForm = ({props}) => {

    const formType = props.name;
    
    switch(formType){
      case 'Group':
        return <SelectGroup props={props} />
      case 'Date':
        return <ExpenseDateTimePicker />
      default:
        return <SelectExpenseType />
    }

  }

  export default NestedModalForm;