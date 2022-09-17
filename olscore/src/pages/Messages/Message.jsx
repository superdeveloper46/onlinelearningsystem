import * as React from "react";
import clsx from "clsx";
import ImgProfile from "../../assets/images/profile-img.png";

function Message({ name, time, message, isMe, avatar }) {
  return (
    <div
      className={clsx("chat-message", {
        "chat-message-me": isMe,
      })}
    >
      <div className="avatar">
        <img src={ImgProfile} alt="Profile" />
      </div>
      <div className="chat-content">
        <div className="chat-info">
          <div className="chat-user">{isMe ? "You" : name}</div>
          <div className="chat-time">{time}</div>
        </div>
        <div className="chat-text">{message}</div>
      </div>
    </div>
  );
}

export default Message;
