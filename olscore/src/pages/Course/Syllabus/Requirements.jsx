import * as React from "react";
import { Row, Col } from "react-bootstrap";

function Requirements({ syllabusData }) {
  return (
    <Row className="syllabus-content-wrapper">
      <Col md={6} className="syllabus-content__left">
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">Technology Requirements</h6>
          <p>
            In order to successfully participate in and complete this online
            class/the online portion of this class, students need the following
            minimum technology:
          </p>
          {/** Techonologies */}
          <p>
            Contact the professor if you have questions or cannot currently meet
            the technology requirements for the course. LWTech has some
            technology available to checkout. To request a basic tablet with
            Internet access or a webcam, contact Sally Heilstedt
            (Sally.Heilstedt@LWTech.edu).
          </p>
          <h6 className="syllabus-info-header">
            Open Educational Resources (OER)
          </h6>
          <p>
            This course uses Open Educational Resources (OER), which are
            available through LetsUseData. OER are teaching, learning, and
            research resources that reside in the public domain or have been
            released under an intellectual property license that permits their
            free use and re-purposing by others. OER include full courses,
            course materials, modules, textbooks, streaming videos, tests,
            software, and any other tools, materials, or techniques used to
            support access to knowledge. "OER Defined" by The William and Flora
            Hewlett Foundation is licensed under CC BY 3.0
          </p>
        </div>
      </Col>
      <Col md={6} className="syllabus-content__right">
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">Others</h6>
          <div className="d-flex items-align-center mb-4 flex-wrap">
            <div className="course-info-item">
              <span className="item__header"> TEXTBOOK </span>
              <span className="item__content"> </span>
            </div>
            <div className="course-info-item">
              <span className="item__header"> SUPPLIES </span>
              <span className="item__content"> </span>
            </div>
          </div>
          <div className="d-flex items-align-center mb-4 flex-wrap">
            <div className="course-info-item">
              <span className="item__header"> NATERIALS </span>
              <span className="item__content"> </span>
            </div>
          </div>
          <div className="d-flex items-align-center mb-4 flex-wrap">
            <div className="course-info-item">
              <span className="item__header"> Required Tools </span>
              <span className="item__content"> </span>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Requirements;
