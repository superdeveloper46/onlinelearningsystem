import * as React from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";

import UserDropdown from "../user-dropdown";

import "./index.scss";
import Icons from "../../assets/icons";
import Skeleton from "react-loading-skeleton";

function UserNavigation({ question }) {
  const Profile = useSelector((store) => store.auth.Profile);

  return (
    <div className={clsx("user-navigation")}>
      {question && (
        <div className="user-action">
          <button
            className="btn-action-outline"
            style={{ height: 48, width: 48 }}
          >
            <Icons.Question></Icons.Question>
          </button>
        </div>
      )}
      {question && <div className="divider"></div>}
      <div className="user-avatar">
        {Profile.Photo ? (
          <img src={Profile.Photo} alt="Profile" />
        ) : (
          <Skeleton width={52} height={52} circle={true}></Skeleton>
        )}
      </div>
      {Profile.FullName && (
        <div className="user-info">
          <div className="user-name">{Profile.FullName}</div>
          <div className="user-email">{Profile.Email}</div>
        </div>
      )}
      {!Profile.FullName && (
        <div className="user-info">
          <Skeleton height={24} width={120}></Skeleton>
          <Skeleton height={16} width={120}></Skeleton>
        </div>
      )}
      <UserDropdown />
    </div>
  );
}

UserNavigation.defaultProps = {
  darkMode: true,
  question: false,
};

export default UserNavigation;
