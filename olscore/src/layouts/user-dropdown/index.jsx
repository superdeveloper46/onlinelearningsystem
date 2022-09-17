import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Icons from "../../assets/icons";
import { ReactComponent as IconUserFilled } from "../../assets/icons/auth/user-filled.svg";
import { ReactComponent as AlignCenterFilled } from "../../assets/icons/align-center-filled.svg";
import { ReactComponent as LogoutFilled } from "../../assets/icons/logout-filled.svg";

import { signout } from "../../store/auth.slice";

import ImpersonateDialog from "./ImpersonateDialog";

import "./index.scss";

function UserDropdown({ style }) {
  const IsAdmin = useSelector((store) => store.auth.Admin.IsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = React.useRef(null);
  const [showImpersonateDialog, setShowImpersonateDialog] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("click", function (event) {
      if (!menuRef?.current?.contains(event.target)) {
        setOpen(false);
      }
    });
    return () => {
      window.removeEventListener("click", null);
    };
  }, []);

  const [open, setOpen] = React.useState(false);
  return (
    <div className="user-dropdown">
      <button className="user-dropdown-btn" onClick={() => setOpen(!open)} style={style} ref={menuRef}>
        <Icons.Action.ChevronDown></Icons.Action.ChevronDown>
      </button>
      <div className="user-dropdown-content" style={{ display: open ? "block" : "none" }}>
        <NavLink to="/profile">
          <IconUserFilled></IconUserFilled> User Profile
        </NavLink>
        {IsAdmin && (
          <Link
            to="#"
            onClick={(e) => {
              setShowImpersonateDialog(true);
              e.preventDefault();
            }}
          >
            <AlignCenterFilled></AlignCenterFilled> Impersonate
          </Link>
        )}
        <div className="user-dropdown-divider"></div>
        <NavLink
          to="/logout"
          className="logout-link"
          onClick={() => {
            dispatch(signout());
            navigate("/login");
          }}
        >
          <LogoutFilled></LogoutFilled> Log out
        </NavLink>
      </div>
      <ImpersonateDialog
        show={showImpersonateDialog}
        onHide={() => {
          setShowImpersonateDialog(false);
        }}
      ></ImpersonateDialog>
    </div>
  );
}

UserDropdown.defaultProps = {
  style: {},
};

export default UserDropdown;
