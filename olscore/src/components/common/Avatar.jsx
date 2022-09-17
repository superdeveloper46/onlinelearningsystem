import React from "react";
import "./Avatar.scss";

function Avatar({ src, size, style }) {
  return (
    <span className="cm-avatar" style={{ ...style, width: size, height: size }}>
      <img src={src} alt="A" style={{ width: size, height: size }} />
    </span>
  );
}

Avatar.defaultProps = {
  size: 28,
  style: {},
};

export default Avatar;
