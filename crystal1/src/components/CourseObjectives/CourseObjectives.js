import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoaderSpinner from "../Common/LoaderSpinner";
import "./CourseObjectives.css";
import "../../styles/general.css";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getObjectives, getObjectivesLoadGrades } from "../../api/course";

// Objective function returns each individual course objective which contains modules
const Objective = ({ objective, courseId, grades }) => {
	return (
		<div className="course-objective-area">
			<div id={`${objective.Id}pnLayout`}>
				{objective.Modules.map((mod, index) => (
					<div className="box courseobjs module-progress" key={mod.ModuleId}>
						<Module
							key={mod.ModuleId}
							module={mod}
							objectiveID={objective.Id}
							courseId={courseId}
							grade={grades ? grades[index] : null}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const Module = ({ module, objectiveID, courseId, grade }) => {
	const svgBtnArrow = (
		<svg
			width="47"
			height="16"
			viewBox="0 0 47 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{ marginLeft: "1em" }}
		>
			<path
				d="M46.7071 8.70711C47.0976 8.31659 47.0976 7.68342 46.7071 7.2929L40.3431 0.928936C39.9526 0.538411 39.3195 0.538411 38.9289 0.928936C38.5384 1.31946 38.5384 1.95262 38.9289 2.34315L44.5858 8L38.9289 13.6569C38.5384 14.0474 38.5384 14.6805 38.9289 15.0711C39.3195 15.4616 39.9526 15.4616 40.3431 15.0711L46.7071 8.70711ZM-8.74228e-08 9L46 9L46 7L8.74228e-08 7L-8.74228e-08 9Z"
				fill="white"
			/>
		</svg>
	);

	return (
		<div className="d-flex flex-column flex-lg-row">
			<div className="modsec-lefttop">
				<div className="module-title text-lg-start text-center ">
					{module.Description}
				</div>

				<div
					id={`${objectiveID}_${module.ModuleId}details`}
					className="module-objectives-label"
				>
					{module.ModuleObjectives}
				</div>
				{module.DueDate !== "" ? (
					<div
						id={`${objectiveID}_${module.ModuleId}dueDate`}
						className="due-date"
					>
						<FaClock style={{ marginRight: ".5em" }} />
						{module.DueDate}
					</div>
				) : null}
				<div className="progress">
					{" "}
					{grade ? (
						<div
							id={`${objectiveID}_${module.ModuleId}strokeDashArray`}
							className={
								"progress-bar" + (grade.Completion >= 100 ? " full" : "")
							}
							role="progressbar"
							style={{ width: `${grade.Completion}%` }}
							aria-valuenow={grade.Completion}
							aria-valuemin="0"
							aria-valuemax="100"
						></div>
					) : (
						/* Progress bar while loading grade information */
						<div
							className="bg-info progress-bar-striped progress-bar-animated"
							role="progressbar"
							style={{
								width: "100%",
								height: "0.5rem",
								position: "absolute",
								top: 0,
								left: 0,
								borderRadius: "0.25rem",
							}}
							aria-valuenow="100"
							aria-valuemin="0"
							aria-valuemax="100"
						/>
					)}
				</div>
			</div>
			{/*Bottom right button section*/}
			<div className="modsec-rightbottom">
				<Link to={`/course/${courseId}/module/${module.ModuleId}`}>
					<button
						id={`${objectiveID}_${module.ModuleId}btnModule`}
						className={
							"mt-4 mt-lg-0 button solid courseobjs" +
							(grade && grade.Completion === 100 ? " full" : "")
						}
						type="button"
					>
						{grade && grade.Completion === 100 ? "Review" : "Access"}
						{svgBtnArrow}
					</button>
				</Link>
			</div>
		</div>
	);
};
export default function Course() {
	const { courseInstanceId } = useParams();
	const [grades, setGrades] = useState(null);
	const [objectiveList, setObjectiveList] = useState(null);
	const [courseName, setCourseName] = useState("");

	useEffect(() => {
		getObjectives(courseInstanceId)
			.then((resCourse) => {
				getObjectivesLoadGrades(courseInstanceId).then((resGrades) => {
					setObjectiveList(resCourse.CourseObjectiveList);
					setCourseName(resCourse.Name);
					setGrades(resGrades);
				});
			})
			.catch((e) => console.log("Error: ", e));
	}, [courseInstanceId]);

	return (
		<div id="course_objectives">
			{/* Show load spinner until objectives load */}
			{objectiveList ? (
				<section className="page-content">
					<div className="container px-xl-4">
						<div className="pnlPanel">
							<div className="course-objective-area">
								<Link to={"/courses"}>Home</Link> &gt; {courseName}
							</div>
							{objectiveList.map((obj, index) => (
								<Objective
									key={obj.Id}
									objective={obj}
									courseId={courseInstanceId}
									grades={grades ? grades[index].Modules : null}
								></Objective>
							))}
						</div>
					</div>
				</section>
			) : (
				<LoaderSpinner />
			)}
		</div>
	);
}
