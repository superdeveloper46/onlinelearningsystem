import * as React from "react";
import HeaderCourse from "../../../../layouts/header-course";
import { NavLink } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

import CourseTitleProgress from "../../components/CourseTitleProgress";
import IconBreadcrumbDivider from "../../../../assets/icons/breadcrumb-divider.svg";
import DashboardIcon from "../../../../assets/icons/dashboard.svg";

function PageVideoModule() {
  return (
    <React.Fragment>
      <HeaderCourse nav={true}></HeaderCourse>
      <main className="main-content-wrapper">
        <Breadcrumb className="course-breadcrumb">
          <li className="breadcrumb-item active">
            <NavLink to="/">
              <span className="list-icon">
                <img src={DashboardIcon} alt="" />
              </span>
              Dashboard
            </NavLink>
          </li>
          <li className="breadcrumb-divider">
            <img src={IconBreadcrumbDivider} alt=""></img>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            CSD 298 Technical Interview
          </li>
          <li className="breadcrumb-divider">
            <img src={IconBreadcrumbDivider} alt=""></img>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            Overview (Week 1)
          </li>
        </Breadcrumb>
        <CourseTitleProgress></CourseTitleProgress>
        <div className="page-content-wrapper">
          <div className="page-content">
            

          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default PageVideoModule;
