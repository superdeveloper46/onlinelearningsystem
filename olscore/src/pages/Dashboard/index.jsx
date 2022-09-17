import React, { useState, useEffect } from "react";
import moment from "moment";
import clsx from "clsx";
import "moment-timezone";
import { useSelector } from "react-redux";
import Profile from "./Profile";
import UserDropdown from "../../layouts/user-dropdown";

import CourseCarousel from "./CourseCarousel";
import GradeBreakdown from "./GradeBreakdown";

import "./Dashboard.scss";

import SearchField from "../../components/fields/SearchField";
import Icons from "../../assets/icons";

export default function PageDashboard(props) {
  const StudentName = useSelector((store) => store.auth.Student.Name);
  const courseList = useSelector((store) => store.course.CourseList);
  const [NowTime, setNowTime] = useState(moment().tz("America/Los_Angeles").format("h:mm A"));
  const [NowDate, SetNowDate] = useState(moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));
  const [keyword, setKeyword] = useState("");
  const [profileOpened, setProfileOpened] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  React.useEffect(() => {
    setInterval(() => {
      SetNowDate(moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));
      setNowTime(moment().tz("America/Los_Angeles").format("h:mm A"));
    }, 15 * 1000);
  }, []);

  return (
    <div className="dashboard-container">
      <div className={clsx("dashboard-content-wrapper", { opened: profileOpened })}>
        <header className="dashboard-header">
          <div className="header__left">
            <h1>Welcome Back, {StudentName}</h1>
            <div className="header-info d-flex align-items-center">
              <span>{NowDate}</span>
              <label className="dot"></label>
              <span>{NowTime} WITA</span>
            </div>
          </div>
          <div className="header__right d-flex align-items-center">
            <SearchField
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 240 }}
            ></SearchField>
            <button className="btn-action-outline" style={{ marginLeft: "1rem" }}>
              <Icons.Notification></Icons.Notification>
            </button>
            {!profileOpened && <UserDropdown style={{ marginLeft: "1rem", height: 50 }}></UserDropdown>}
          </div>
        </header>
        <main className="dashboard-content">
          <CourseCarousel
            profileOpened={profileOpened}
            courseList={courseList.filter((course) => {
              let trimed = keyword.trim().toLocaleLowerCase();
              if (trimed.length === 0) return true;
              if (course.Name.toLowerCase().includes(trimed)) return true;
              return false;
            })}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          ></CourseCarousel>
          <GradeBreakdown CourseInstanceId={selectedCourse?.CourseInstanceId}></GradeBreakdown>
        </main>
      </div>
      <Profile
        open={profileOpened}
        setOpen={(t) => {
          setProfileOpened(t);
        }}
      ></Profile>
    </div>
  );
}
