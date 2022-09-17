import * as React from "react";
import { Row, Col } from "react-bootstrap";
import Icons from "../../../assets/icons";

function Policies({ syllabusData }) {
  return (
    <Row className="syllabus-content-wrapper">
      <Col md={6} className="syllabus-content__left">
        <div className="syllabus-content">
          {syllabusData?.Policies?.map((policy, index) => (
            <div className="syllabus-article" key={`syllabus-policy-${index}`}>
              {policy.Subtitle.length > 0 && (
                <h6 className="syllabus-info-header">{policy.Subtitle}</h6>
              )}
              {policy.Description.length > 0 && <p>{policy.Description}</p>}
              {policy.Points?.length > 0 && (
                <ul className="syllabus-content-list">
                  {policy.Points.map((point, idx) => (
                    <li key={idx}>
                      <span>
                        <Icons.ListStyle></Icons.ListStyle>
                      </span>
                      <span>{point.Description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <h6 className="syllabus-info-header">Community Standards</h6>
          {syllabusData?.CommunityStandards?.map((data, index) => (
            <div
              className="syllabus-article"
              key={`syllabus-community-standard-${index}`}
            >
              <h6 className="syllabus-info-subheader">{data.Subtitle}</h6>
              <p>{data.Description}</p>
            </div>
          ))}
        </div>
        <div className="syllabus-content">
          <h6 className="syllabus-info-header">What is "Netiquette"?</h6>
          {syllabusData?.Netiquette?.map((data, index) => (
            <div
              className="syllabus-article"
              key={`syllabus-netiquette-${index}`}
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
          <h6 className="syllabus-info-header">
            Support Services During LWTech Remote Operations
          </h6>
          {syllabusData?.SupportServices?.map((service, index) => (
            <div
              className="syllabus-article"
              key={`syllabus-support-service-${index}`}
            >
              <h6 className="syllabus-info-subheader">{service.Subtitle}</h6>
              <p>{service.Description}</p>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
}

export default Policies;
