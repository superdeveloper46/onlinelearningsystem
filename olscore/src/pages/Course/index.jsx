import * as React from "react";
import { Outlet, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { readCourse } from "../../store/course.slice.js";

import { setCourseLoading } from "../../store/course.slice.js";

function PageCourse() {
  const isLoading = useSelector((store) => store.course.isLoading);
  const dispatch = useDispatch();
  const { courseInstanceId } = useParams();

  React.useEffect(() => {
    if (!isLoading) {
      dispatch(setCourseLoading(true));
      dispatch(readCourse(courseInstanceId));
    }
  }, [courseInstanceId, dispatch, isLoading]);

  return <Outlet></Outlet>;
}

export default PageCourse;
