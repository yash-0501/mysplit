import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function DateTimePickerValue({ props }) {
  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const expenseFormData = props.expenseFormData;
  const setExpenseFormData = props.setExpenseFormData;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker"]}>
        <DateTimePicker
          disableFuture
          label="Controlled picker"
          value={dayjs(formatDate(expenseFormData.expenseDate))}
          onChange={(newValue) => {
            const newDate = new Date(newValue).getTime();
            setExpenseFormData({ ...expenseFormData, expenseDate: newDate });
          }}
          onClose={props.handleClose}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
