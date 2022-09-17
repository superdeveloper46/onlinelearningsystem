import React, { useState } from "react";
import moment from "moment";
import clsx from "clsx";
import { Row, Col, Tabs, Tab, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

import Icons from "../../assets/icons";
import Clock from "../../components/common/Clock";
import TableStudents from "./tables/TableStudents";
import TableRequest from "./tables/TableRequest";

import "./Students.scss";

export default function PageStudent(props) {
  const StudentName = useSelector((store) => store.auth.Student.Name);
  const [keyword, setKeyword] = useState("");
  const [openDialogNewCourse, setOpenDialogNewCourse] = useState(false);
  const [tabKey, setTabKey] = useState("overview");

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div className="header__left">
          <h1>Students</h1>
          <Clock></Clock>
        </div>
        <div className="header__right d-flex align-items-center">
          <button className="btn-action-outline" style={{ marginLeft: "1rem" }}>
            <Icons.Notification></Icons.Notification>
          </button>
          <button className="btn-action-outline" style={{ marginLeft: "1rem" }}>
            <Icons.Notification></Icons.Notification>
          </button>
        </div>
      </header>
      <main className="page-content">
        <div className="tabs-wrapper">
          <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)} className="mb-3 nav-line-tabs">
            <Tab eventKey="overview" title="Overview">
              <TableStudents></TableStudents>
            </Tab>
            <Tab eventKey="materials" title="Materials"></Tab>
            <Tab eventKey="quizes" title="Quizes"></Tab>
            <Tab eventKey="assignments" title="Assignments"></Tab>
            <Tab eventKey="polls" title="Polls"></Tab>
            <Tab eventKey="request" title="Request">
              <TableRequest></TableRequest>
            </Tab>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
