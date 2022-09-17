import * as React from "react";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { ReactComponent as IconStepNavToggle } from "../../../../assets/icons/actions/step-nav-toggle.svg";
import { ReactComponent as IconStepNavToggleClose } from "../../../../assets/icons/actions/step-nav-toggle-close.svg";
import Icons from "../../../../assets/icons";

import "./ModuleNavigation.scss";

function ModuleNavigation({ activities, activity }) {
  const [open, setOpen] = React.useState(true);
  const [, setSearchParams] = useSearchParams();

  return (
    <div className={clsx("step-nav", { "step-nav-opened": open })}>
      <div className="step-nav-toggle">
        <h3> CourseList </h3>
        <i
          className="svg-icon"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {!open ? <IconStepNavToggle></IconStepNavToggle> : <IconStepNavToggleClose></IconStepNavToggleClose>}
        </i>
      </div>
      <div className="step-nav-content">
        <div className="menu-header">
          <span className="menu-header-toggle">
            <Icons.Action.ChevronDown></Icons.Action.ChevronDown>
          </span>
          <span className="menu-header-title">Self Instruction</span>
        </div>
        <div className="menu-item-list">
          {activities.map((step, index) => {
            return (
              <React.Fragment key={step.ActivityId}>
                <div
                  className={clsx("menu-item", {
                    success: step.Completion >= 100,
                    active: activity?.ActivityId === step.ActivityId,
                  })}
                  onClick={() => {
                    setSearchParams({
                      ActivityId: step.ActivityId,
                    });
                  }}
                >
                  <span
                    className={clsx("menu-item__icon", {
                      "icon-success": step.Completion >= 100,
                      "icon-progress": activity?.ActivityId === step.ActivityId,
                    })}
                  >
                    {step.Completion >= 100 && <Icons.Success></Icons.Success>}
                    {step.Completion < 100 && (
                      <React.Fragment>
                        {step.type === "Material" && <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>}
                        {step.type === "Quiz" && <Icons.Course.QuizFilled></Icons.Course.QuizFilled>}
                        {step.type === "Assignment" && <Icons.Course.AssignmentFilled></Icons.Course.AssignmentFilled>}
                        {step.type === "Poll" && <Icons.Course.PollFilled></Icons.Course.PollFilled>}
                      </React.Fragment>
                    )}
                  </span>
                  <span className="menu-item__title">{step.Title}</span>
                </div>
                {index < activities.length - 1 && (
                  <div
                    className={clsx("menu-item-divider", {
                      success: step.Completion >= 100,
                    })}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* <div className="menu-item-divider success"></div>
          <div className="menu-item success">
            <span className="menu-item__icon icon-success">
              <Icons.Success></Icons.Success>
            </span>
            <span className="menu-item__title">What is Time Complexity And Why Is It Essential?</span>
          </div>
          <div className="menu-item-divider success"></div>
          <div className="menu-item success">
            <span className="menu-item__icon icon-progress">
              <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
            </span>
            <span className="menu-item__title">Time and Space Complexity Analysis of Algorithms</span>
          </div>
          <div className="menu-item-divider"></div>
          <div className="menu-item">
            <span className="menu-item__icon">
              <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
            </span>
            <span className="menu-item__title">Space Complexity of Algorithms</span>
          </div>
          <div className="menu-item-divider"></div>
          <div className="menu-item">
            <span className="menu-item__icon">
              <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
            </span>
            <span className="menu-item__title">Quiz 2</span>
          </div>
          <div className="menu-item-divider"></div>
          <div className="menu-item">
            <span className="menu-item__icon">
              <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
            </span>
            <span className="menu-item__title">Assignment : Missing Number -N to N</span>
          </div>
          <div className="menu-item-divider"></div>
          <div className="menu-item">
            <span className="menu-item__icon">
              <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
            </span>
            <span className="menu-item__title">Poll / Survey</span>
          </div>
        </div>
        */}
        {/* <div className="step-divider step-divider-success"></div>
        <div className="step-icon step-icon-progress">
          <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
        </div>
        <div className="step-divider"></div>
        <div className="step-icon step-icon-default">
          <Icons.Course.AssignmentFilled></Icons.Course.AssignmentFilled>
        </div>
        <div className="step-divider step-divider-success"></div>
        <div className="step-icon step-icon-progress">
          <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
        </div>
        <div className="step-divider"></div>
        <div className="step-icon step-icon-default">
          <Icons.Course.AssignmentFilled></Icons.Course.AssignmentFilled>
        </div>
        <div className="step-divider step-divider-success"></div>
        <div className="step-icon step-icon-progress">
          <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
        </div>
        <div className="step-divider"></div>
        <div className="step-icon step-icon-default">
          <Icons.Course.AssignmentFilled></Icons.Course.AssignmentFilled>
        </div>
        <div className="step-divider step-divider-success"></div>
        <div className="step-icon step-icon-progress">
          <Icons.Course.MaterialFilled></Icons.Course.MaterialFilled>
        </div>
        <div className="step-divider"></div>
        <div className="step-icon step-icon-default">
          <Icons.Course.AssignmentFilled></Icons.Course.AssignmentFilled>
        </div> */}{" "}
        <div className="menu-header">
          <span className="menu-header-toggle">
            <Icons.Action.ChevronDown></Icons.Action.ChevronDown>
          </span>
          <span className="menu-header-title">Physically Preparation</span>
        </div>
        <div className="menu-header">
          <span className="menu-header-toggle">
            <Icons.Action.ChevronDown></Icons.Action.ChevronDown>
          </span>
          <span className="menu-header-title">Sample Questions</span>
        </div>
        <div className="menu-header">
          <span className="menu-header-toggle">
            <Icons.Action.ChevronDown></Icons.Action.ChevronDown>
          </span>
          <span className="menu-header-title">I Don’t Know What Else</span>
        </div>
      </div>
    </div>
  );
}

export default ModuleNavigation;
