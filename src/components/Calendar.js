// src/components/Calendar.js
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-container">
      <h1>수정 테스트2</h1>
      <Calendar onChange={setDate} value={date} />
      <p>선택한 날짜: {date.toDateString()}</p>
    </div>
  );
};

export default MyCalendar;
