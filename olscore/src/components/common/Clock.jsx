import React, { useState, useEffect } from "react";
import moment from "moment";

function Clock() {
  const [NowTime, setNowTime] = useState(moment().tz("America/Los_Angeles").format("h:mm A"));
  const [NowDate, SetNowDate] = useState(moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));

  useEffect(() => {
    setInterval(() => {
      SetNowDate(moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));
      setNowTime(moment().tz("America/Los_Angeles").format("h:mm A"));
    }, 15 * 1000);
  }, []);
  return (
    <div className="header-clock d-flex align-items-center">
      <span>{NowDate}</span>
      <label
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#d1d1d1",
          margin: "0px 6px",
        }}
      ></label>
      <span>{NowTime} WITA</span>
    </div>
  );
}

export default Clock;
