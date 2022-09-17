import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MainLayout from "../layouts/StudentMainLayout.jsx";
import PageDashboard from "../pages/Dashboard/index.jsx";
import PageCalendar from "../pages/Calendar/index.jsx";
import PageMessages from "../pages/Messages/index.jsx";
import PageProfile from "../pages/Profile/Profile.jsx";
import ErrorPage from "../pages/Error404/index.jsx";
import ContactUs from "../pages/auth/ContacUs/index.jsx";

import CoursePageLayout from "../pages/Course/index.jsx";
import PageCourseSyllabus from "../pages/Course/Syllabus/index.jsx";
import PageCourseOverview from "../pages/Course/Overview/index.jsx";
import PageCourseModule from "../pages/Course/Module/index.jsx";

import { readCourses } from "../store/course.slice";
import { readProfileInfo } from "../store/auth.slice.js";

function AuthenticatedRoutes() {
  const dispatch = useDispatch();
  const Hash = useSelector( store => store.auth.Student.Hash);

  React.useEffect(() => {
    dispatch(readCourses());
    dispatch(readProfileInfo());
  }, [dispatch, Hash]);

  return (
    <Routes>
      <Route path="/contactus" element={<ContactUs></ContactUs>}></Route>
      <Route path="/" element={<MainLayout></MainLayout>}>
        <Route path="" index element={<PageDashboard></PageDashboard>}></Route>
        <Route path="dashboard" element={<PageDashboard></PageDashboard>}></Route>
        <Route path="calendar" element={<PageCalendar></PageCalendar>}></Route>
        <Route path="messages" element={<PageMessages></PageMessages>}></Route>
        <Route path="profile" element={<PageProfile></PageProfile>}></Route>
      </Route>
      <Route path="course/:courseInstanceId" element={<CoursePageLayout></CoursePageLayout>}>
        <Route path="overview" element={<PageCourseOverview></PageCourseOverview>}></Route>
        <Route path="syllabus" element={<PageCourseSyllabus></PageCourseSyllabus>}></Route>
        <Route path="module/:moduleId" element={<PageCourseModule></PageCourseModule>}></Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default AuthenticatedRoutes;
