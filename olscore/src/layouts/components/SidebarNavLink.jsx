import * as React from "react";
import { NavLink } from "react-router-dom";

function SidebarNavLink({ to, children }) {
  return <NavLink to={to} className="sidebar-navlink">{children}</NavLink>;
}

export default SidebarNavLink;
