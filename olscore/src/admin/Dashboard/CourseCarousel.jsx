import * as React from "react";
import Slider from "react-slick";
import clsx from "clsx";
import { ProgressBar, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Icons from "../../assets/icons";

import "./CourseCarousel.scss";

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  variableWidth: true,
  arrows: false,
};

export default function CourseCarousel({ courseList, profileOpened }) {
  const navigate = useNavigate();
  const slider = React.useRef(null);

  return (
    <div className={clsx("course-carousel", { opened: profileOpened })}>
      <Slider {...settings} ref={slider}>
        {courseList.map((course, index) => (
          <div key={course.CourseInstanceId}>
            <div className="course-card">
              <div className="video-container">
                <h3 className="course-title">{course.Name}</h3>
                <div>
                  <div className="video-part">
                    <img src={`/assets/images/course/${(index % 4) + 1}.jpg`} alt="Course Title"></img>
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className="course-stat-title"> STUDENTS </div>
                      <div className="course-stat-content">
                        <Icons.Peoples></Icons.Peoples> 35
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="course-stat-title"> MODULES </div>
                      <div className="course-stat-content">
                        <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled> 150
                      </div>
                    </Col>
                  </Row>
                  <button
                    className="button button-primary button-block mt-3"
                    style={{
                      padding: "10px",
                      fontSize: 12,
                      lineHeight: "18px",
                      height: 40,
                    }}
                    onClick={() => {
                      navigate(`/course/${course.CourseInstanceId}/overview`);
                    }}
                  >
                    Enter Course
                  </button>
                  <button
                    className="button button-primary button-block button-outline mt-2"
                    style={{
                      padding: "10px",
                      fontSize: 12,
                      lineHeight: "18px",
                      height: 40,
                    }}
                    onClick={() => {
                      navigate(`/course/${course.CourseInstanceId}/edit/modules`);
                    }}
                  >
                    Edit Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      {courseList.length > 0 && (
        <button
          className="btn-card-nav btn-card-prev"
          onClick={() => {
            slider.current.slickPrev();
          }}
        >
          <Icons.Action.ChevronLeft />
        </button>
      )}
      {courseList.length > 0 && (
        <button
          className="btn-card-nav btn-card-next"
          onClick={() => {
            slider.current.slickNext();
          }}
        >
          <Icons.Action.ChevronRight></Icons.Action.ChevronRight>
        </button>
      )}
    </div>
  );
}
