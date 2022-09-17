import * as React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import HeaderCourse from "../../../layouts/header-course";
import SidebarCourse from "../../../layouts/sidebar-course";
import SearchField from "../../../components/fields/SearchField";

import ModuleOverview from "./ModuleOverview";

import "./index.scss";

function PageCourseOverview() {
  const Course = useSelector((store) => store.course.Course);

  return (
    <React.Fragment>
      <HeaderCourse nav={true}></HeaderCourse>
      <main className="main-content-wrapper d-flex">
        <SidebarCourse></SidebarCourse>
        <div className="page-content-wrapper">
          <div className="page-header d-flex justify-content-between">
            <div className="page-header__left">
              <h1 className="page-title">Overview</h1>
              <div
                style={{
                  marginRight: 16,
                  marginLeft: 16,
                  borderLeft: "2px solid #D9D9D9",
                  height: 40,
                }}
              ></div>
            </div>
            <div className="page-header__right">
              <SearchField></SearchField>
            </div>
          </div>
          <Row>
            {Course.Modules.map((module, index) => (
              <Col xl={6} md={12} key={module.ModuleId}>
                <ModuleOverview
                  courseId={Course.CourseInstanceId}
                  module={module}
                ></ModuleOverview>
              </Col>
            ))}
          </Row>
        </div>
      </main>
    </React.Fragment>
  );
}

export default PageCourseOverview;
