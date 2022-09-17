import * as React from "react";
import SidebarAdmin from "./sidebar-admin";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <SidebarAdmin></SidebarAdmin>
      <div className="page-container">
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default MainLayout;
