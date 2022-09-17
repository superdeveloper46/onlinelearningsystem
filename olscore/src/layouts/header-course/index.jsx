import * as React from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Images from "../../assets/images";
import BackButton from "../../components/buttons/BackButton";
import UserNavigation from "../user-navigation";

import "./index.scss";
function HeaderCourse({ syllabus }) {
  const navigate = useNavigate();
  const isAdmin = useSelector((store) => store.auth.Admin.IsAdmin);
  const CourseInstanceId = useSelector((store) => store.course.CourseInstanceId);
  // const { courseInstanceId, moduleId } = useParams();
  return (
    <header className="header-course">
      {!syllabus && (
        <div className="header-logo">
          <NavLink to="/">
            <img src={Images.LogoDefaultImgTag} alt="Logo" />
          </NavLink>
        </div>
      )}
      {syllabus && (
        <BackButton
          onClick={() => {
            if (CourseInstanceId > 0) {
              navigate(`/course/${CourseInstanceId}/overview`);
            }
          }}
        ></BackButton>
      )}
      {isAdmin && CourseInstanceId > 0 && (
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav-link" to={`/course/${CourseInstanceId}/edit/modules`}>
              Modules
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`/course/${CourseInstanceId}/edit/members`}>
              Members
            </NavLink>
          </li>
        </ul>
      )}
      {syllabus && <h2>Class syllabus</h2>}
      <UserNavigation></UserNavigation>
    </header>
  );
}

// HeaderCourse.defaultProps = {
//   nav: false,
// };

export default HeaderCourse;
