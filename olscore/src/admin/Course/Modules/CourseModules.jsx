import * as React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import SearchField from "../../../components/fields/SearchField";

import ModuleOverview from "./ModuleOverview";

import "./CourseModules.scss";
import Clock from "../../../components/common/Clock";

function PageCourseOverview() {
  const Course = useSelector((store) => store.course.Course);

  return (
    <div className="page-content-wrapper">
      <div className="page-header d-flex justify-content-between">
        <div className="page-header__left flex-column align-items-start">
          <h1 className="page-title">Overview</h1>
          <Clock></Clock>
        </div>
        <div className="page-header__right">
          <SearchField></SearchField>
        </div>
      </div>
      <Row>
        {Course.Modules.map((module, index) => (
          <Col xl={6} md={12} key={module.ModuleId}>
            <ModuleOverview courseId={Course.CourseInstanceId} module={module}></ModuleOverview>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default PageCourseOverview;
