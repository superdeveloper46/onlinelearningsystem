import * as React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import SearchField from "../../../components/fields/SearchField";
import Clock from "../../../components/common/Clock";
import TableStudents from "./TableStudents";

import Icons from "../../../assets/icons";

import "./CourseMembers.scss";

function PageCourseMembers() {
  const Course = useSelector((store) => store.course.Course);

  return (
    <div className="page-content-wrapper">
      <div className="page-header d-flex justify-content-between">
        <div className="page-header__left flex-column align-items-start">
          <h1 className="page-title">Members</h1>
          <Clock></Clock>
        </div>
        <div className="page-header__right">
          <SearchField></SearchField>
        </div>
      </div>
      <Row>
        <Col md={12}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary">
                Current Student (112)
              </button>
              <button type="button" className="btn btn-disabled">
                Requests (41)
              </button>
            </div>
            <div className="d-flex align-items-center">
              <div className="icon-buttons">
                <button className="icon-button">
                  <Icons.ContactBook></Icons.ContactBook>
                </button>
                <button className="icon-button active">
                  <Icons.List></Icons.List>
                </button>
              </div>
              <button className="button button-primary">+ ADD STUDENT</button>
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="horizontal-divider"></div>
        </Col>
        <Col md={12}>
          <TableStudents></TableStudents>
        </Col>
      </Row>
    </div>
  );
}

export default PageCourseMembers;
