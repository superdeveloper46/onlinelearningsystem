import * as React from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Sidebar></Sidebar>
      <div className="page-container">
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default MainLayout;
