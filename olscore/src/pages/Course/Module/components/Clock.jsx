import * as React from "react";
import Icons from "../../../../assets/icons";

function Clock({ date }) {
  return (
    <div
      style={{ padding: 12, color: "#0092CE", background: "rgba(0, 146, 206, 0.05)", borderRadius: 8 }}
      className="d-flex align-items-center"
    >
      <i className="svg-icon svg-icon-primary mx-2">
        <Icons.Clock></Icons.Clock>
      </i>
      <span
        style={{
          fontWeight: 500,
          fontSize: 18,
          lineHeight: "21px",
          color: "#0092CE",
        }}
      >
        {date}
      </span>
    </div>
  );
}

Clock.defaultProps = {
  date: "July 12, 2022 at 8:30 pm",
};

export default Clock;
