import * as React from "react";
import Material from "./Material/Material";
import Quiz from "./Quiz/Quiz";
import Assignment from "./Assignment/Assignment";
import Poll from "./Poll/Polls";

function Activity(props) {
  const { activity } = props;
  if (activity.type === "Material") {
    return <Material {...props}></Material>;
  }

  if (activity.type === "Quiz") {
    return <Quiz {...props}></Quiz>;
  }

  if (activity.type === "Poll") {
    return <Poll {...props}></Poll>;
  }

  if (activity.type === "Assignment") {
    return <Assignment {...props}></Assignment>;
  }

  return <div></div>;
}

export default Activity;
