import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import Icons from "../../../../assets/icons";
import Skeleton from "react-loading-skeleton";

function ModuleBreadCrumb({ courseName, moduleName, courseId, moduleId }) {
  return (
    <Breadcrumb className="course-breadcrumb">
      <li className="breadcrumb-item active">
        <NavLink to="/dashboard">
          <span className="list-icon">
            <Icons.Sidebar.Dashboard></Icons.Sidebar.Dashboard>
          </span>
          Dashboard
        </NavLink>
      </li>
      <li className="breadcrumb-divider">
        <Icons.BreadcrumbDivider></Icons.BreadcrumbDivider>
      </li>
      <li className="breadcrumb-item active" aria-current="page">
        <NavLink to={`/course/${courseId}/overview`}>
          {courseName || <Skeleton count={1} height={24} width={120} />}
        </NavLink>
      </li>
      <li className="breadcrumb-divider">
        <Icons.BreadcrumbDivider></Icons.BreadcrumbDivider>
      </li>
      <li className="breadcrumb-item" aria-current="page">
        {moduleName ? (
          `Course (${moduleName})`
        ) : (
          <Skeleton count={1} height={24} width={120} />
        )}
      </li>
    </Breadcrumb>
  );
}

ModuleBreadCrumb.defaultProps = {
  isOverview: true,
};

export default ModuleBreadCrumb;
