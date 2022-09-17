import * as React from "react";
import { Row, Col, Table } from "react-bootstrap";

function Grading({ syllabusData }) {
  return (
    <Row className="syllabus-content-wrapper">
      <Col md={6} className="syllabus-content__left">
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">Grading</h6>
          <p>{syllabusData?.GradingPolicy}</p>
          <div className="d-flex items-align-center mb-4 flex-wrap mt-5">
            {syllabusData?.GradeScaleWeights.map((item, idx) => (
              <div className="course-info-item" key={idx}>
                <span className="item__header"> {item.Description} </span>
                <span className="item__content"> {item.Weight}% </span>
              </div>
            ))}
          </div>
        </div>
      </Col>
      <Col md={6} className="syllabus-content__right">
        <div className="syllabus-content">
          <h6 className="syllabus-info-subheader" style={{ marginTop: -3 }}>
            Grading Scale
          </h6>
          <Row>
            <Col lg={6} md={12}>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>GPA</th>
                    <th>Points In</th>
                  </tr>
                </thead>
                <tbody>
                  {syllabusData?.GradeScales.slice(
                    0,
                    syllabusData?.GradeScales.length / 2 +
                      (syllabusData?.GradeScales.length % 2)
                  ).map((data, idx) => (
                    <tr key={idx}>
                      <td>{data.GPA}</td>
                      <td>{data.Point}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col lg={6} md={12}>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>GPA</th>
                    <th>Points In</th>
                  </tr>
                </thead>
                <tbody>
                  {syllabusData?.GradeScales.slice(
                    -syllabusData?.GradeScales.length / 2
                  ).map((data, idx) => (
                    <tr key={idx}>
                      <td>{data.GPA}</td>
                      <td>{data.Point}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}

export default Grading;
