import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerEarnings.css"; // Asegúrate de crear este archivo CSS para estilos

const DatePickerEarnings = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div className="date-picker-earnings">
      <h3>Selecciona una fecha:</h3>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
      />
    </div>
  );
};

export default DatePickerEarnings;
