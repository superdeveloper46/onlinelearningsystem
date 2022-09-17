import * as React from "react";

import UserNavigation from "../../layouts/user-navigation";
import Icons from "../../assets/icons";
import SearchField from "../../components/fields/SearchField";
import Message from "./Message.jsx";
import "./Messages.scss";

function PageMessages() {
  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="messages-title">
          <h5> Message </h5>
          <span className="message-note">
            <Icons.Note></Icons.Note>
          </span>
        </div>
        <div className="message-search">
          <SearchField></SearchField>
        </div>
        <div className="messages-contact-list">
          <div className="contact-item active">
            <div className="contact-avatar">
              <img src="/assets/images/download.png" alt="Avatar" />
              <div className="dot"></div>
            </div>
            <div className="contact-detail">
              <div className="contact-name">Jenny Wilson</div>
              <div className="contact-role typing">3 Person Typing...</div>
            </div>
            <div className="contact-actions">
              <div className="last-time"> 5:45 PM </div>
              <div className="status">
                <div className="unread-message">15</div>
              </div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-avatar">
              <img src="/assets/images/download.png" alt="Avatar" />
              <div className="dot"></div>
            </div>
            <div className="contact-detail">
              <div className="contact-name">Jenny Wilson</div>
              <div className="contact-role typing">Typing...</div>
            </div>
            <div className="contact-actions"></div>
          </div>
          <div className="contact-item">
            <div className="contact-avatar">
              <img src="/assets/images/download.png" alt="Avatar" />
              <div className="dot"></div>
            </div>
            <div className="contact-detail">
              <div className="contact-name">Jenny Wilson</div>
              <div className="contact-role">Singing Teacher</div>
            </div>
            <div className="contact-actions"></div>
          </div>
        </div>
        <div className="messages-all">
          <Icons.Message></Icons.Message> ALL Messages
        </div>
        <div className="messages-contact-list">
          <div className="contact-item">
            <div className="contact-avatar">
              <img src="/assets/images/download.png" alt="Avatar" />
              <div className="dot"></div>
            </div>
            <div className="contact-detail">
              <div className="contact-name">Jenny Wilson</div>
              <div className="contact-role typing">Typing...</div>
            </div>
            <div className="contact-actions"></div>
          </div>
          <div className="contact-item">
            <div className="contact-avatar">
              <img src="/assets/images/download.png" alt="Avatar" />
              <div className="dot"></div>
            </div>
            <div className="contact-detail">
              <div className="contact-name">Jenny Wilson</div>
              <div className="contact-role typing">Typing...</div>
            </div>
            <div className="contact-actions"></div>
          </div>
          <div className="contact-item">
            <div className="contact-avatar">
              <img src="/assets/images/download.png" alt="Avatar" />
              <div className="dot"></div>
            </div>
            <div className="contact-detail">
              <div className="contact-name">Jenny Wilson</div>
              <div className="contact-role typing">Typing...</div>
            </div>
            <div className="contact-actions"></div>
          </div>
        </div>
      </div>
      <div className="messages-content">
        <div className="messages-content-header">
          <div className="messages-content-header__left">
            <div className="current-user">
              <div className="avatar">
                <img src="/assets/images/download.png" alt="Avatar" />
                <div className="dot"></div>
              </div>
              <div className="contact-detail">
                <div className="contact-name">UI Design - Batch #2</div>
                <div className="contact-role">27 Members, 10 Online</div>
              </div>
            </div>
          </div>
          <div className="messages-content-header__right">
            <UserNavigation></UserNavigation>
          </div>
        </div>
        <div className="message-chatbox">
          <Message
            name="John Cena"
            message={"Have a nice day everyone"}
            time="8:31 AM"
            avatar=""
          ></Message>
          <div className="divider-line">
            <span>Yesterday</span>
          </div>
          <Message
            name="Jefri Marcus"
            message={
              "Hey everyone, today i make a login screen for crypto web, what do you guys think ?"
            }
            time="10:21 AM"
            avatar=""
          ></Message>
          <Message
            message={"That's cool bro"}
            time="10:30 AM"
            avatar=""
            isMe={true}
          ></Message>
        </div>
        <div className="message-chatinput">
          <div className="message-input">
            <input type="text" placeholder="Your messages..."></input>
            <button className="button-ghost button-attachment">
              <Icons.Attachment></Icons.Attachment>
            </button>
            <div className="divider"></div>
            <button className="button-ghost button-send">
              <Icons.Send></Icons.Send>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageMessages;
