import * as React from "react";
import { Row, Col } from "react-bootstrap";
import Icons from "../../../assets/icons";
import Skeleton from "react-loading-skeleton";

function CourseInformation({ syllabusData }) {
  return (
    <Row className="syllabus-content-wrapper">
      <Col md={6} className="syllabus-content__left">
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">About The Course</h6>
          <p className="course-syllabus-message">
            {syllabusData ? (
              syllabusData?.Quarter.SyllabusMessage
            ) : (
              <Skeleton height={24} count={5}></Skeleton>
            )}
          </p>
          <div className="d-flex items-align-center mt-4 mb-4">
            <div className="course-info-item">
              <span className="item__header">Credits</span>
              <span className="item__content">
                {syllabusData ? (
                  syllabusData?.Credits
                ) : (
                  <Skeleton height={24}></Skeleton>
                )}
              </span>
            </div>
            <div className="course-info-item">
              <span className="item__header">Academic Calender</span>
              <span className="item__content">
                <span className="syllabus-link">
                  {syllabusData ? (
                    syllabusData?.Quarter.Calendar
                  ) : (
                    <Skeleton height={24}></Skeleton>
                  )}
                </span>
              </span>
            </div>
          </div>
          <h6 className="syllabus-info-header">
            Student Outcomes/Competencies
          </h6>
          <p>
            Upon successful completion of this course students will be able to:
          </p>
          <ul className="syllabus-content-list">
            {syllabusData?.Outcomes?.length > 0 ? (
              syllabusData?.Outcomes?.map((data, idx) => (
                <li key={idx}>
                  <span>
                    <Icons.ListStyle></Icons.ListStyle>
                  </span>
                  <span>{data.Description}</span>
                </li>
              ))
            ) : (
              <Skeleton height={28} count={5}></Skeleton>
            )}
          </ul>
          <h6 className="syllabus-info-header">
            Method of Instruction &amp; Course Delivery
          </h6>
          <ul>
            {syllabusData?.InstructionMethods?.map((item, index) => (
              <li key={index} className="mb-2">
                {item.Description}
              </li>
            ))}
          </ul>
        </div>
      </Col>
      <Col md={6} className="syllabus-content__right">
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">No Classess</h6>
          <p>The following are non-academic days for this quarter:</p>
        </div>
      </Col>
    </Row>
  );
}

export default CourseInformation;
