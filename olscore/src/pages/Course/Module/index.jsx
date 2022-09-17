import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import HeaderCourse from "../../../layouts/header-course";
import ModuleHeader from "./components/ModuleHeader";
import ModuleNavigation from "./components/ModuleNavigation";
import ModuleBreadcrumb from "./components/ModuleBreadcrumb";

import Activity from "./Activity";
import "./index.scss";

import { readModuleObjective, setLoading } from "../../../store/module.slice";

function ModulePageLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseInstanceId, moduleId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const Course = useSelector((store) => store.course.Course);
  const Module = useSelector((store) => store.module);
  const activities = useSelector((store) => store.module.Activities);

  const [activity, setActivity] = React.useState({});

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch(readModuleObjective({ courseInstanceId, moduleId }));
  }, [dispatch, courseInstanceId, moduleId]);

  React.useEffect(() => {
    if (parseInt(moduleId) === Module.ModuleId) {
      if (Module.Activities.length > 0) {
        const ActivityId = searchParams.get("ActivityId");
        if (ActivityId) {
          const activity = Module.Activities.find(
            (activity) => activity.ActivityId === parseInt(ActivityId)
          );
          if (activity) {
            setActivity(activity);
            return;
          }
        }
        setSearchParams({
          ActivityId: Module.Activities[0].ActivityId,
        });
      } else {
        navigate(`/course/${courseInstanceId}/overview`);
      }
    }
  }, [
    moduleId,
    Module,
    courseInstanceId,
    navigate,
    searchParams,
    setSearchParams,
  ]);

  return (
    <React.Fragment>
      <HeaderCourse nav={true}></HeaderCourse>
      <main className="main-content-wrapper">
        <ModuleBreadcrumb
          moduleName={Module?.Description}
          moduleId={moduleId}
          courseId={courseInstanceId}
          courseName={Course?.Name}
        ></ModuleBreadcrumb>
        <ModuleHeader
          moduleName={Module?.Description}
          courseName={Course?.Name}
          activities={activities}
        ></ModuleHeader>
        <div className="page-content-wrapper">
          <ModuleNavigation
            activities={activities}
            activity={activity}
          ></ModuleNavigation>
          <Activity activities={activities} activity={activity}></Activity>
        </div>
      </main>
    </React.Fragment>
  );
}

export default ModulePageLayout;
