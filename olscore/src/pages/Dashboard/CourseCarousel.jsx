import * as React from "react";
import Slider from "react-slick";
import clsx from "clsx";
import { ProgressBar } from "react-bootstrap";
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

export default function CourseCarousel({ courseList, profileOpened, selectedCourse, setSelectedCourse }) {
  const navigate = useNavigate();
  const slider = React.useRef(null);

  return (
    <div className={clsx("course-carousel", { opened: profileOpened })}>
      <Slider {...settings} ref={slider}>
        {courseList.map((course, index) => (
          <div key={course.CourseInstanceId}>
            <div
              className={clsx("course-card", {
                active: selectedCourse?.CourseInstanceId === course?.CourseInstanceId,
              })}
              onClick={() => {
                setSelectedCourse(course);
              }}
            >
              <div className="video-container">
                <div className="course-title-wrapper d-flex justify-content-between align-items-center mb-3">
                  <h3 className="course-title">{course.Name}</h3>
                  {selectedCourse?.CourseInstanceId === course?.CourseInstanceId ? (
                    <Icons.RadioChecked></Icons.RadioChecked>
                  ) : (
                    <Icons.Radio></Icons.Radio>
                  )}
                </div>
                <div>
                  <div className="video-part">
                    <img src={`/assets/images/course/${(index % 4) + 1}.jpg`} alt="Course Title"></img>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <button className="online-status">
                      <Icons.Online></Icons.Online> Online{" "}
                    </button>
                    <div className="grade-title">
                      On Track Grade : <span className="text-success">{course.TotalGrade}</span>
                    </div>
                  </div>
                  <button
                    className="button button-primary button-block"
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
                    Enter
                  </button>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center card-footer-part">
                <div className="w-75 custom-progress-bar">
                  <ProgressBar now={course.TotalCompletion} />
                </div>
                <label>{course.TotalCompletion}%</label>
              </div>
              {course.TotalCompletion >= 100 ? (
                <div className="message message-success">
                  <Icons.Action.Like></Icons.Action.Like> You are up to date
                </div>
              ) : (
                <div className="message message-warning">
                  <Icons.Action.Warning></Icons.Action.Warning> You have work to complete
                </div>
              )}
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
