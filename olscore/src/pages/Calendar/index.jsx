import * as React from "react";
import CalendarContent from "./CalendarContent";
import CalendarSidebar from "./CalendarSidebar";

import "./index.scss";

function PageCalendar() {
  return (
    <div className="calendar-container">
      <CalendarContent />
      <CalendarSidebar />
    </div>
  );
}

export default PageCalendar;
