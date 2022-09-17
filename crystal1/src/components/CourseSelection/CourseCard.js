import React from "react";
import { FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";
const CourseCard = ({ course, grade }) => {
	return (
		<div className="boxcontainer selcourse col-12 col-md-6 col-lg-4">
			<div className="box selcourse">
				<div className="course-quarter">{course.Quarter}</div>
				<h1 className="course-name">{course.Name}</h1>
				{/*Progress bar*/}

				<div className="progresssection selcourse">
					{grade ? ( //change to grade..
						<div className="progress progressbody selcourse">
							<div
								id={`${course.CourseInstanceId}TotalCompletionProgressBar`}
								className="progress-bar progressfillsolid selcourse"
								role="progressbar"
								style={{ width: `${grade.TotalCompletion}%` }}
								aria-valuenow={grade.TotalCompletion}
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div>
					) : (
						<div className="progress progressbody selcourse">
							<div
								id="LoadingCompletionProgressBar"
								className="bg-info progress-bar-striped progress-bar-animated progressanistripe selcourse"
								role="progressbar"
								style={{ width: "100%", height: "4px" }}
								aria-valuenow="100"
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div>
					)}
				</div>
				<div className="d-flex flex-row justify-content-between align-items-center">
					<div className="d-flex flex-column gradecompleted">
						<div>
							Completed:&nbsp;
							<span
								className={grade && grade.TotalCompletion === 100 ? "full" : ""}
							>
								{grade ? (
									grade.TotalCompletion + "%"
								) : (
									<FaSync className="spinner" icon="spinner" />
								)}
							</span>
						</div>
						<div className={grade && grade.TotalGrade ? "d-block" : "d-none"}>
							Grade:&nbsp;
							<span
								className={grade && grade.TotalCompletion >= 100 ? "full" : ""}
							>
								{grade ? (
									grade.TotalGrade
								) : (
									<FaSync className="spinner" icon="spinner" />
								)}
							</span>
						</div>
					</div>
					<Link to={`/courseobjectives/${course.CourseInstanceId}`}>
						<button
							type="button"
							className={
								"button solid selcourse" +
								(grade && grade.TotalCompletion >= 100 ? " full" : "")
							}
						>
							{grade ? (
								grade.TotalCompletion === 0 ? (
									"Start"
								) : grade.TotalCompletion >= 100 ? (
									"Review"
								) : (
									"Continue"
								)
							) : (
								<FaSync className="spinner" icon="spinner" />
							)}
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;
