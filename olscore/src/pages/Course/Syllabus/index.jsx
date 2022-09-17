import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderCourse from "../../../layouts/header-course";
import { Row, Col, Nav, Tab } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import ProfileImg from "../../../assets/images/profile-img.png";
import CommonIcons from "../../../assets/icons";
import Icons from "./icons";
import { toast } from "../../../libs";
import { getSyllabus } from "../../../apis/course";
import CourseInformation from "./CourseInformation";
import Grading from "./Grading";
import Procedure from "./Procedure";
import Policies from "./Policies";
import Requirements from "./Requirements";

import "./index.scss";

function PageSyllabus() {
  const navigate = useNavigate();
  const { courseInstanceId } = useParams();
  const [syllabusData, setSyllabusData] = React.useState(null);

  React.useEffect(() => {
    getSyllabus(courseInstanceId)
      .then((data) => {
        if (!data.CourseName) {
          toast.error("Syllabus Data is null.");
          navigate(`/course/${courseInstanceId}/overview`);
        }
        setSyllabusData(data);
      })
      .catch(() => {})
      .then(() => {});
  }, [courseInstanceId, navigate]);

  return (
    <React.Fragment>
      <HeaderCourse syllabus={true}></HeaderCourse>
      <main className="main-content-wrapper d-flex">
        <div
          className="page-content-wrapper"
          style={{ backgroundColor: "#ffffff" }}
        >
          <Row>
            <Col md={4} lg={3}>
              <h1 className="font-20 mb-3">
                {syllabusData ? (
                  syllabusData?.CourseName
                ) : (
                  <Skeleton height={24}></Skeleton>
                )}
              </h1>
              <div className="d-flex align-items-center">
                <div className="user-avatar">
                  <img src={ProfileImg} alt="Profile" />
                </div>
                <div className="user-info">
                  <h6 className="user-name"> Marcelo Guerra Hahn </h6>
                  <div className="user-email">
                    marcelo.guerrahahn@lwtech.edu
                  </div>
                </div>
              </div>
              <div className="navigation"></div>
            </Col>
            <Col md={8} lg={9}>
              <div className="syllabus-header">
                <div className="syllabus-header__left">
                  <div className="course-info-item">
                    <span className="item__header">LECTURE</span>
                    <span className="item__content">
                      Asynchronous Course - No Lecture
                    </span>
                  </div>
                  <div className="course-info-item">
                    <span className="item__header">Location</span>
                    <span className="item__content">
                      {syllabusData?.Sessions?.length > 0 ? (
                        <span> No Location </span>
                      ) : (
                        <span>
                          Online via{" "}
                          <a href="http://letsusedata.com">Lets Use Data</a>
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="course-info-item">
                    <span className="item__header">Last Day</span>
                    <span className="item__content">
                      {syllabusData?.Quarter?.WithdrawDate}
                    </span>
                  </div>
                </div>
                <div className="syllabus-header__right">
                  <button className="button button-primary">
                    <CommonIcons.Course.Download></CommonIcons.Course.Download>{" "}
                    Download PDF
                  </button>
                </div>
              </div>
            </Col>
          </Row>
          <Tab.Container id="left-tabs-example" defaultActiveKey="information">
            <Row>
              <Col sm={12} md={4} lg={3}>
                <Nav className="flex-column syllabus-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="information">
                      <Icons.Information></Icons.Information> Course Information
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="requirements">
                      <Icons.Requirements></Icons.Requirements> Requirements
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="grading">
                      <Icons.Grading></Icons.Grading> Grading
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="policies">
                      <Icons.Policies></Icons.Policies> Policies
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="procedure">
                      <Icons.Procedure></Icons.Procedure> Procedure
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={12} md={8} lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="information">
                    <CourseInformation
                      syllabusData={syllabusData}
                    ></CourseInformation>
                  </Tab.Pane>
                  <Tab.Pane eventKey="requirements">
                    <Requirements syllabusData={syllabusData}></Requirements>
                  </Tab.Pane>
                  <Tab.Pane eventKey="grading">
                    <Grading syllabusData={syllabusData}></Grading>
                  </Tab.Pane>
                  <Tab.Pane eventKey="policies">
                    <Policies syllabusData={syllabusData}></Policies>
                  </Tab.Pane>
                  <Tab.Pane eventKey="procedure">
                    <Procedure syllabusData={syllabusData}></Procedure>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </main>
    </React.Fragment>
  );
}

export default PageSyllabus;
