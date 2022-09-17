import * as React from "react";
import clsx from "clsx";
import { ReactComponent as IconLike } from "./IconLike.svg";
import { ReactComponent as IconDislike } from "./IconDislike.svg";
import { ReactComponent as IconLikeFilled } from "./IconLikeFilled.svg";
import { ReactComponent as IconDislikeFilled } from "./IconDislikeFilled.svg";

function LikeButton({ style, like, className, liked, disabled, ...props }) {
  return (
    <button
      className={clsx("btn-like", className, {
        "lb-like": like,
        "lb-dislike": !like,
        liked: liked,
      })}
      style={style}
      disabled={disabled}
      {...props}
    >
      {like ? liked ? <IconLikeFilled /> : <IconLike /> : liked ? <IconDislikeFilled /> : <IconDislike />}
      {like ? "Like" : "Dislike"}
    </button>
  );
}

LikeButton.defaultProps = {
  like: true,
  liked: false,
  style: {},
  className: "",
  disabled: false,
};

export default LikeButton;
