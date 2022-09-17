import * as React from "react";
import Icons from "../../../../assets/icons";
import Skeleton from "react-loading-skeleton";

import "./ModuleHeader.scss";

function ModuleHeader({ activities, moduleName, courseName }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{
        borderBottom: "1px solid #D9D9D9",
        paddingTop: 12,
        paddingLeft: 48,
        paddingRight: 48,
        paddingBottom: 16,
      }}
    >
      <h1
        style={{
          fontWeight: 700,
          fontSize: 20,
          lineHeight: "22px",
          color: "#404040",
          margin: 0,
        }}
      >
        {courseName ? (
          `${courseName} : ${moduleName}`
        ) : (
          <Skeleton count={1} height={36} width={240} />
        )}
      </h1>
      <div>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span
            style={{
              fontWeight: 500,
              fontSize: 13,
              lineHeight: "20px",
              color: "#353535",
            }}
          >
            {activities.filter((step) => step.Completion >= 100).length} /{" "}
            {activities.length} COMPLETED
          </span>
          <span>
            <Icons.Course.Badge></Icons.Course.Badge>
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between module-progress">
          {activities.map((step) => (
            <span
              key={step.ActivityId}
              style={{
                backgroundColor: step.Completion >= 100 ? "#0092CE" : "#D9D9D9",
                borderRadius: 2,
                height: 14,
                width: 40,
              }}
            ></span>
          ))}
          {/* {[...Array(cntCompleted).keys()].map((value) => (
            <span key={`completed-${value}`} style={{ background: "#0092CE", borderRadius: 2, height: 14, width: 40 }}></span>
          ))}
          {[...Array(activities.length - cntCompleted).keys()].map((value) => (
            <span key={`uncompleted-${value}`} style={{ background: "#D9D9D9", borderRadius: 2, height: 14, width: 40 }}></span>
          ))} */}
        </div>
      </div>
    </div>
  );
}

export default ModuleHeader;
