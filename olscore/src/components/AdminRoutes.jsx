import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import AdminMainLayout from "../layouts/AdminMainLayout.jsx";
import PageDashboard from "../admin/Dashboard/Dashboard";
import PageStudents from "../admin/Students/Students";

import ErrorPage from "../pages/Error404/index.jsx";
// import PageDashboard from "../pages/Dashboard/index.jsx";
import PageCalendar from "../pages/Calendar/index.jsx";
import PageMessages from "../pages/Messages/index.jsx";
// import PageProfile from "../pages/Profile/Profile.jsx";

// import ContactUs from "../pages/auth/ContacUs/index.jsx";

import CoursePageLayout from "../pages/Course/index.jsx";
import PageCourseSyllabus from "../pages/Course/Syllabus/index.jsx";
import PageCourseOverview from "../pages/Course/Overview/index.jsx";
import PageCourseModule from "../pages/Course/Module/index.jsx";
import PageCourseEditModules from "../admin/Course/Modules/CourseModules";
import PageCourseEditMembers from "../admin/Course/Members/CourseMembers.jsx";

import { readCourses } from "../store/course.slice";
import { readProfileInfo } from "../store/auth.slice.js";
import CourseEditLayout from "../admin/Course/CourseEditLayout.jsx";

function AdminRoutes() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(readCourses());
    dispatch(readProfileInfo());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<AdminMainLayout></AdminMainLayout>}>
        <Route path="" index element={<PageDashboard></PageDashboard>}></Route>
        <Route path="students" element={<PageStudents></PageStudents>}></Route>
        <Route path="calendar" element={<PageCalendar></PageCalendar>}></Route>
        <Route path="messages" element={<PageMessages></PageMessages>}></Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route path="course/:courseInstanceId" element={<CoursePageLayout></CoursePageLayout>}>
        <Route path="overview" element={<PageCourseOverview></PageCourseOverview>}></Route>
        <Route path="syllabus" element={<PageCourseSyllabus></PageCourseSyllabus>}></Route>
        <Route path="module/:moduleId" element={<PageCourseModule></PageCourseModule>}></Route>
        <Route path="edit" element={<CourseEditLayout></CourseEditLayout>}>
          <Route path="modules" element={<PageCourseEditModules></PageCourseEditModules>}></Route>
          <Route path="members" element={<PageCourseEditMembers></PageCourseEditMembers>}></Route>
        </Route>
      </Route>
      {/* <Route path="/contactus" element={<ContactUs></ContactUs>}></Route>
      
        <Route path="profile" element={<PageProfile></PageProfile>}></Route>

      </Route>
      <Route
        path="course/:courseInstanceId"
        element={<CoursePageLayout></CoursePageLayout>}
      >
        <Route
          path="overview"
          element={<PageCourseOverview></PageCourseOverview>}
        ></Route>
        <Route
          path="syllabus"
          element={<PageCourseSyllabus></PageCourseSyllabus>}
        ></Route>
        <Route
          path="module/:moduleId"
          element={<PageCourseModule></PageCourseModule>}
        ></Route>
      </Route> */}
    </Routes>
  );
}

export default AdminRoutes;
