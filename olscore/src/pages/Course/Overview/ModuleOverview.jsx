import * as React from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { getModuleObjective } from "../../../apis/course";
import Icons from "../../../assets/icons";
import clsx from "clsx";

function WeekOverview({ courseId, module }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(module.Completion >= 100);
  const [ModuleObjectives, setModuleObjectives] = React.useState(null);
  React.useEffect(() => {
    getModuleObjective(courseId, module.ModuleId)
      .then((data) => {
        setModuleObjectives(data.ModuleObjectives[0]);
        // if (module.Completion < 100) setCollapsed(false);
      })
      .catch(() => {});
  }, [courseId, module.ModuleId, module.Completion]);

  return (
    <div className="module-overview">
      <div className="module-header">
        <div className="module-header__left">
          <span className="module-icon">
            <Icons.Sidebar.Calendar></Icons.Sidebar.Calendar>
          </span>
          <span className="module-title"> {module.Description} </span>
        </div>
        <div className="module-header__right">
          <span
            className="btn-action-ghost"
            onClick={() => setCollapsed(!collapsed)}
          >
            {!collapsed ? (
              <Icons.Action.ChevronUp></Icons.Action.ChevronUp>
            ) : (
              <Icons.Action.ChevronDown></Icons.Action.ChevronDown>
            )}
          </span>
        </div>
      </div>
      <div
        className={clsx(
          "module-body d-flex align-items-center justify-content-between",
          {
            collapsed: collapsed,
          }
        )}
      >
        <div className="module-detail d-flex ">
          <div className="module-info-group d-flex flex-column me-3">
            <span className="module-info mb-2">
              <Icons.Course.Material></Icons.Course.Material>
              {ModuleObjectives ? (
                `${ModuleObjectives?.Materials.length} Material${
                  ModuleObjectives?.Materials.length > 1 ? "s" : ""
                }`
              ) : (
                <Skeleton width={100}></Skeleton>
              )}
            </span>
            <span className="module-info">
              <Icons.Course.Quiz />
              {ModuleObjectives ? (
                `${ModuleObjectives?.Quizzes.length} Quiz${
                  ModuleObjectives?.Quizzes.length > 1 ? "zes" : ""
                }`
              ) : (
                <Skeleton width={100}></Skeleton>
              )}
            </span>
          </div>
          <div className="module-info-group d-flex flex-column">
            <span className="module-info mb-2">
              <Icons.Course.Assignment />
              {ModuleObjectives ? (
                `${ModuleObjectives?.Assessments.length} Assignment${
                  ModuleObjectives?.Assessments.length > 1 ? "s" : ""
                }`
              ) : (
                <Skeleton width={100}></Skeleton>
              )}
            </span>
            <span className="module-info">
              <Icons.Course.Poll />
              {ModuleObjectives ? (
                `${ModuleObjectives?.Polls.length} Poll${
                  ModuleObjectives?.Polls.length > 1 ? "s" : ""
                }`
              ) : (
                <Skeleton width={100}></Skeleton>
              )}
            </span>
          </div>
        </div>
        {module.Completion < 100 ? (
          <button
            className="button button-primary ml-4 px-3"
            onClick={() => {
              navigate(`/course/${courseId}/module/${module.ModuleId}`);
            }}
          >
            Continue
          </button>
        ) : (
          <button
            className="button button-success button-outline ml-4 px-3"
            onClick={() => {
              navigate(`/course/${courseId}/module/${module.ModuleId}`);
            }}
          >
            Review
          </button>
        )}
      </div>
      <div
        className={clsx("module-footer d-flex align-items-center px-2", {
          "mt-2": collapsed,
        })}
      >
        <div className="progress flex-grow-1" style={{ height: 4 }}>
          <div
            role="progressbar"
            className={clsx("progress-bar", {
              "bg-primary": module.Completion < 100,
              "bg-success": module.Completion >= 100,
            })}
            style={{ width: `${module.Completion}%` }}
          ></div>
        </div>
        <span className="progress-value ps-4 pe-2 font-600 text-secondary">
          {module.Completion}%
        </span>
      </div>
    </div>
  );
}

export default WeekOverview;
