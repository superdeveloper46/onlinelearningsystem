import * as React from "react";
import LoaderImg from "./loader-transparent-big.gif";
import "./index.scss";
import clsx from "clsx";

function OlsLoader({ full }) {
  return (
    <div
      id="loader-spinner"
      className={clsx("loader-bg", {
        "full-loader-img": full,
        "loader-img": !full,
      })}
    >
      <img src={LoaderImg} alt="Loading..." />
    </div>
  );
}

OlsLoader.defaultProps = {
  full: true,
};

export default OlsLoader;
