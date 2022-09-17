import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import clsx from "clsx";
import { Row, Col } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import UserDropdown from "../../layouts/user-dropdown";

import Icons from "../../assets/icons";
import { ReactComponent as IconCourseList } from "../../assets/icons/course-list.svg";
import ImageLWTech from "../../assets/images/LWTech.png";

import "./Profile.scss";

function Profile({ open, setOpen }) {
  const CourseList = useSelector((store) => store.course.CourseList);
  const Profile = useSelector((store) => store.auth.Profile);
  const navigate = useNavigate();

  return (
    <div className={clsx("profile-container", { opened: open })}>
      <div className="profile-header">
        <div
          className="step-nav-toggle"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <i className="svg-icon">{open ? <Icons.Action.ToggleOpened /> : <Icons.Action.ToggleClosed />}</i>
        </div>
        <h2> Profile </h2>
        <UserDropdown></UserDropdown>
      </div>
      <div className="profile-content">
        <div className="profile-photo">
          {Profile.Photo ? (
            <img src={Profile.Photo} alt="Avatar"></img>
          ) : (
            <Skeleton width={150} height={150} circle></Skeleton>
          )}
        </div>
        <div className="profile-info">
          <h2 className="fullname">{Profile.FullName || <Skeleton height={40}></Skeleton>}</h2>
        </div>
      </div>
      <Row>
        <Col xs={12} md={6}>
          <div className="profile-school">
            <div className="img-wrapper">
              <img src={ImageLWTech} alt="" />
            </div>
            <div className="profile-list-info">
              <h4>School</h4>
              <span>LWTech</span>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="profile-courses">
            <div className="img-wrapper">
              <IconCourseList></IconCourseList>
            </div>
            <div className="profile-list-info">
              <h4>Courses</h4>
              <span>{CourseList.length} Courses</span>
            </div>
          </div>
        </Col>
      </Row>
      <div className="upcoming-container">
        <div className="upcoming-header">
          <label>Upcoming</label>
          <button className="blue-btn-text" onClick={() => {
            navigate("/calendar");
          }}>
            See All <Icons.Action.ChevronRight></Icons.Action.ChevronRight>
          </button>
        </div>
        <hr />
        <div className="upcoming-card-body">
          <div className="upcoming-list-container">
            <div className="first-container">
              <label>9:00 AM</label>
              <span>Fri, July 2nd</span>
            </div>
            <div className="middle-container">
              <label className="border-first">&nbsp;</label>
            </div>
            <div className="last-container">
              <label>Data 310</label>
              <span>2nd Semester Test</span>
            </div>
          </div>
          <div className="upcoming-list-container">
            <div className="first-container">
              <label>9:00 AM</label>
              <span>Fri, July 2nd</span>
            </div>
            <div className="middle-container">
              <label className="border-second">&nbsp;</label>
            </div>
            <div className="last-container">
              <label>CSD 298 Tecinal Interview</label>
              <span>Last Test</span>
            </div>
          </div>
          <div className="upcoming-list-container">
            <div className="first-container">
              <label>8:00 AM</label>
              <span>Sat, July 3rd</span>
            </div>
            <div className="middle-container">
              <label className="border-third">&nbsp;</label>
            </div>
            <div className="last-container">
              <label>C++ Programming</label>
              <span>Remidial Test</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
