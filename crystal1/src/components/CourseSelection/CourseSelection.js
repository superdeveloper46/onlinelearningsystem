import React, { useEffect, useState } from "react";
import LoaderSpinner from "../Common/LoaderSpinner";
import CourseCard from "./CourseCard";
import "./CourseSelection.css";
import "../../styles/general.css";
import { getCourses, getGrades } from "../../api/course";
function Courses() {
	const [courseList, setCourseList] = useState(null);
	const [gradesList, setGradesList] = useState([]);

	useEffect(() => {
		getCourses()
			.then((courses) => {
				getGrades().then((grades) => {
					setCourseList(courses.CourseList);
					setGradesList(grades.CourseList);
				});
			})
			.catch((e) => console.log("Error: ", e));
	}, []);

	return (
		<section className="page-content margin-t-3">
			{courseList ? (
				// Container that maps each course card
				<div className="container px-xl-4">
					<div className="row" id="pnlCourseCard">
						{courseList.map((course, index) => {
							return (
								<CourseCard
									key={course.CourseInstanceId}
									course={course}
									grade={gradesList ? gradesList[index] : null}
								></CourseCard>
							);
						})}
					</div>
				</div>
			) : (
				// Show the load spinner until courses load
				<LoaderSpinner />
			)}
			;
		</section>
	);
}

export default Courses;
