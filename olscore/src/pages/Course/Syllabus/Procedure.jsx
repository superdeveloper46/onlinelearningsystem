import * as React from "react";
import { Row, Col, Table } from "react-bootstrap";
import { utils } from "../../../libs";
import Icons from "../../../assets/icons";

function Procedure({ syllabusData }) {
  return (
    <Row className="syllabus-content-wrapper">
      <Col md={6} className="syllabus-content__left">
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">
            Tentative Assignment Schedule
          </h6>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Week</th>
                <th style={{ minWidth: 300 }}>Topic</th>
                <th>Number of Quizzes</th>
                <th>Assignments</th>
                <th>Test</th>
                <th>Meeting</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {syllabusData?.TentativeAssignmentSchedule?.map((row, index) => (
                <tr key={index}>
                  <td> {row.Title} </td>
                  <td> {row.Topic} </td>
                  <td> {row.QuizCount} </td>
                  <td> {row.AssignmentCount} </td>
                  <td> {row.TypeOfTest} </td>
                  <td> {row.Meeting} </td>
                  <td> {utils.getDueDateString(row.DueDate)} </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h6 className="syllabus-info-header">Campus Public Safety</h6>
          {syllabusData?.CampusPublicSafeties?.map((data, index) => (
            <div
              className="syllabus-article"
              key={`syllabus-campus-public-safety-${index}`}
            >
              <p>{data.Description}</p>
              <ul className="syllabus-content-list">
                {data.Points.map((point, idx) => (
                  <li key={idx}>
                    <span>
                      <Icons.ListStyle></Icons.ListStyle>
                    </span>
                    <span>{point.Description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Col>
      <Col md={6} className="syllabus-content__right">
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">Student Support Resources</h6>
          {syllabusData?.StudentSupportResources?.map((resource, index) => (
            <div
              className="course-info-item"
              key={`student-support-resource-${index}`}
              style={{ marginBottom: 12 }}
            >
              <span className="item__header">{resource.Link}</span>
              <span className="item__content">
                <span className="syllabus-link">{resource.Title}</span>
              </span>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
}

export default Procedure;
