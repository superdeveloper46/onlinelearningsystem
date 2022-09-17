import * as React from "react";
import clsx from "clsx";
import Icons from "../../assets/icons";

function BackButton({ style, onClick }) {
  return (
    <button className={clsx("btn-nav-back")} style={style} onClick={onClick}>
      <Icons.Action.ChevronLeft></Icons.Action.ChevronLeft>
      Back
    </button>
  );
}

BackButton.defaultProps = {
  style: {},
  onClick: () => {},
};

export default BackButton;
