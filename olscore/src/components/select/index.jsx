import * as React from "react";
import "./index.scss";

function Select(props) {
  return (
    <select className="cm-select" {...props}>
      {props.children}
    </select>
  );
}

export default Select;
