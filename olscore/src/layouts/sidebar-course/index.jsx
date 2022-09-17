import * as React from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

import Icons from "../../assets/icons";

import CourseObjective from "./CourseObjective";

import "./index.scss";

function SidebarCourse() {
  const { courseInstanceId } = useParams();
  const Course = useSelector((state) => state.course.Course);
  const navigate = useNavigate();

  return (
    <div className="sidebar-course">
      <Breadcrumb>
        <li className="breadcrumb-item active">
          <NavLink to="/">
            <span className="list-icon">
              <Icons.Sidebar.Dashboard></Icons.Sidebar.Dashboard>
            </span>
            Dashboard
          </NavLink>
        </li>
        <li className="breadcrumb-divider">
          <Icons.BreadcrumbDivider></Icons.BreadcrumbDivider>
        </li>
        <li className="breadcrumb-item" aria-current="page">
          {Course?.Name || (
            <Skeleton width={200} height={20} count={1}></Skeleton>
          )}
        </li>
      </Breadcrumb>
      <div className="course-name d-flex align-items-center justify-content-between">
        <h2 className="m-0">{Course?.Name}</h2>
        <span>{Course?.Quarter}</span>
      </div>
      <h3 className="course-info-label">SYLLABUS</h3>
      <button
        className="button button-outline button-primary w-100"
        onClick={() => {
          navigate(`/course/${courseInstanceId}/syllabus`);
        }}
      >
        <Icons.Course.Syllabus></Icons.Course.Syllabus> Course Syllabus
      </button>
      <h3 className="course-info-label">OVERALL PROGRESS</h3>
      <div className="progress flex-grow-1" style={{ height: 24 }}>
        <div
          role="progressbar"
          className="progress-bar bg-primary"
          style={{ width: `${Course.TotalCompletion || "0"}%` }}
        >
          Grade: {Course?.TotalCompletion || "0"}%
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <Icons.DividerDash></Icons.DividerDash>
        <Icons.DividerDash></Icons.DividerDash>
        <Icons.DividerDash></Icons.DividerDash>
        <Icons.DividerDash></Icons.DividerDash>
        <Icons.DividerDash></Icons.DividerDash>
        <Icons.DividerDash></Icons.DividerDash>
        <span></span>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <span>E</span>
        <span>D</span>
        <span>C</span>
        <span>B</span>
        <span>A</span>
        <span>A+</span>
        <span></span>
      </div>
      <h3 className="course-info-label">Course Objectives</h3>
      <ul className="student-outcomes-list">
        {Course.ObjectiveList.length > 0 &&
          Course.ObjectiveList.map((objective) => (
            <CourseObjective
              key={objective.Id}
              success={objective.Modules.every(
                (module) => module.Completion >= 100
              )}
              detail={objective.Description}
            ></CourseObjective>
          ))}
        {Course.ObjectiveList.length === 0 && (
          <>
            <Skeleton count={5} height={24} />
          </>
        )}
      </ul>
      <h3 className="course-info-label">NEXT TASK</h3>
      <div className="task-item">
        <h3>Missing Number -N to N</h3>
        <h4>Week 1</h4>
        <div className="d-flex align-items-end justify-content-between">
          <div className="flex-grow-1">
            <h5>DUE DATE</h5>
            <span>
              <Icons.Sidebar.Calendar />
              <span className="date">April 18, 2022</span>
            </span>
          </div>
          <div className="progress-circle blue">
            <span className="progress-left">
              <span className="progress-bar"></span>
            </span>
            <span className="progress-right">
              <span className="progress-bar"></span>
            </span>
            <div className="progress-value">90%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarCourse;
