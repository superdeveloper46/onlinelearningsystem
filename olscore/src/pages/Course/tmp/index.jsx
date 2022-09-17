import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";

import HeaderCourse from "../../../layouts/header-course";
import CourseTitleProgress from "../components/CourseTitleProgress";
import ModuleNavigation from "../components/ModuleNavigation";
import ModuleBreadcrumb from "../components/ModuleBreadcrumb";

import "./index.scss";

import { ReactComponent as IconChevronLeft } from "../../../assets/icons/actions/chevron-left.svg";
import { ReactComponent as IconChevronRight } from "../../../assets/icons/actions/chevron-right.svg";
import Icons from "../../../assets/icons/index";
import { LikeButton } from "../../../components/buttons";

function PageCourseModule() {
  const [tabKey, setTabKey] = React.useState("description");
  return (
    <React.Fragment>
      <HeaderCourse nav={true}></HeaderCourse>
      <main className="main-content-wrapper">
        <ModuleBreadcrumb></ModuleBreadcrumb>
        <CourseTitleProgress></CourseTitleProgress>
        <div className="page-content-wrapper">
          <div className="page-content">
            <ModuleNavigation></ModuleNavigation>
            <div className="step-container">
              <div className="step-header d-flex items-center justify-content-between">
                <div className="step-header__left">
                  <h2 className="step-header__title">Find the Missing Number</h2>
                  <span className="step-header__teacher">Bobby Marsh - UI Designer Teacher</span>
                </div>
                <div className="step-header__right d-flex">
                  <button className="btn-action-outline" style={{ marginRight: 8 }}>
                    <IconChevronLeft></IconChevronLeft>
                  </button>
                  <button className="btn-action-outline">
                    <IconChevronRight></IconChevronRight>
                  </button>
                </div>
              </div>
              <div className="step-video-container">
                <div className="step-video-overlay"></div>
                <img src="/assets/images/course/1.jpg" alt="CourseImage"></img>
                <span className="btn-play-video">
                  <Icons.PlayVideo></Icons.PlayVideo>
                </span>
              </div>
              <div className="step-video-actions d-flex">
                <LikeButton like={true} style={{ marginRight: 12 }}></LikeButton>
                <LikeButton like={false}></LikeButton>
              </div>
              <div className="step-detail">
                <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)} className="mb-3 nav-line-tabs">
                  <Tab eventKey="description" title="Description">
                    <p>
                      Eu egestas laoreet faucibus leo commodo et nunc enim facilisis. Malesuada neque nunc, ornare odio a. Vitae pharetra suspendisse egestas eu. Vitae vulputate
                      sed feugiat a. Eu blandit interdum malesuada ipsum egestas lacus facilisi feugiat dictum. Accumsan tristique odio in mollis aliquam, sit odio diam eu. Ac eget
                      tellus odio amet, etiam.
                    </p>
                    <p>
                      Eu egestas laoreet faucibus leo commodo et nunc enim facilisis. Malesuada neque nunc, ornare odio a. Vitae pharetra suspendisse egestas eu. Vitae vulputate
                      sed feugiat a. Eu blandit interdum malesuada ipsum egestas lacus facilisi feugiat dictum. Accumsan tristique odio in mollis aliquam, sit odio diam eu. Ac eget
                      tellus odio amet, etiam.
                    </p>
                  </Tab>
                  <Tab eventKey="transcript" title="Transcript">
                    asdasdasd
                  </Tab>
                  <Tab eventKey="comments" title="Comments">
                    asdasdqweqeqwe
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default PageCourseModule;
