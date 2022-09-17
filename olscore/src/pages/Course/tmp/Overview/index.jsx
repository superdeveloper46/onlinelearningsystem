import * as React from "react";
import HeaderCourse from "../../../../layouts/header-course";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Loader from "../../../../components/loader/ols";
import "./index.scss";
import MaterialsColumn from "./Materials";
import QuizzesColumn from "./Quizzes";
import AssignmentsColumn from "./Assisgnments";
import PollsColumn from "./Polls";
import ModuleBreadCrumb from "../../components/ModuleBreadCrumb";

import { getBreadCrumb, getModuleObjective } from "../../../../apis/course";

function CourseOverview() {
  const [isLoading, setLoading] = React.useState(true);
  const { courseInstanceId, moduleId } = useParams();
  const [module, setModule] = React.useState(null);
  const [ModuleObjective, setModuleObjective] = React.useState(null);

  React.useEffect(() => {
    getBreadCrumb(courseInstanceId, moduleId)
      .then((data) => {
        setModule(data);
        getModuleObjective(courseInstanceId, moduleId)
          .then((data) => {
            setModuleObjective(data.ModuleObjectives[0]);
            setLoading(false);
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, [courseInstanceId, moduleId]);

  return (
    <>
      {isLoading && <Loader></Loader>}
      {!isLoading && (
        <React.Fragment>
          <HeaderCourse nav={true}></HeaderCourse>
          <main className="main-content-wrapper">
            <ModuleBreadCrumb module={module}></ModuleBreadCrumb>
            <div className="page-content-wrapper">
              <div className="page-content">
                <Row>
                  <Col xl={3} lg={4} md={6} sm={12}>
                    <MaterialsColumn module={ModuleObjective}></MaterialsColumn>
                  </Col>
                  <Col xl={3} lg={4} md={6} sm={12}>
                    <QuizzesColumn quizzes={ModuleObjective ? ModuleObjective.Quizzes : []}></QuizzesColumn>
                  </Col>
                  <Col xl={3} lg={4} md={6} sm={12}>
                    <AssignmentsColumn module={ModuleObjective}></AssignmentsColumn>
                  </Col>
                  <Col xl={3} lg={4} md={6} sm={12}>
                    <PollsColumn polls={ModuleObjective ? ModuleObjective.Polls : []}></PollsColumn>
                  </Col>
                </Row>
              </div>
            </div>
          </main>
        </React.Fragment>
      )}
    </>
  );
}

export default CourseOverview;
