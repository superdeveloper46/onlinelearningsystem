import React from "react";
import { Outlet } from "react-router-dom";
import HeaderCourse from "../../layouts/header-course";
import SidebarCourse from "../../layouts/sidebar-course";
import "./CourseEditLayout.scss";

function CourseEditLayout() {
  return (
    <React.Fragment>
      <HeaderCourse nav={true}></HeaderCourse>
      <main className="main-content-wrapper d-flex">
        <SidebarCourse></SidebarCourse>
        <Outlet></Outlet>
      </main>
    </React.Fragment>
  );
}

export default CourseEditLayout;
