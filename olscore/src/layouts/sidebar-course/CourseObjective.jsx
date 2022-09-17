import * as React from "react";
import Icons from "../../assets/icons";

function CourseObjective({ detail, success }) {
  return (
    <li className="student-outcomes-item d-flex">
      <span className="icon">
        {success ? <Icons.Success></Icons.Success> : <Icons.SuccessGray />}
      </span>
      <span className="detail">{detail}</span>
    </li>
  );
}

CourseObjective.defaultProps = {
  success: false,
  detail: "",
};

export default CourseObjective;
