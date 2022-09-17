import React from "react";
import clock from "../../assets/images/clock_icon_red.png";
import { date2str } from "../../utils/date";
import { Link } from "react-router-dom";
export default function ModuleProgress({
	module,
	name,
	courseId,
	moduleId,
	id,
}) {
	return (
		<div className="lstModuleProgress">
			{module.map((data) => (
				<div className="module-o-card" key={data.ActivityId}>
					<div className="row">
						<div className="col">
							{id === undefined ? (
								<Link
									to={`/course/${courseId}/module/${moduleId}/${name}/${data.ActivityId}`}
									className="btn btn-sm m-card-btn"
								>
									{" "}
									{data.Title}{" "}
								</Link>
							) : (
								<Link
									to={`/course/${courseId}/module/${moduleId}/${name}/${data.ActivityId}/moduleObjective/${id}`}
									className="btn btn-sm m-card-btn"
								>
									{data.Title}
								</Link>
							)}
							<div
								id="QuizProgress"
								style={{ display: "block", width: "140px" }}
							>
								<span className="prg-title">Progress</span>
								<span id="QuizCompletion" className="prg-val">
									{data.Completion}
								</span>

								<div className="progress">
									<div
										id="QuizModuleProgressBar"
										className="progress-bar"
										role="progressbar"
										aria-valuemin="0"
										aria-valuemax="100"
										style={{ width: `${data.Completion}%` }}
										aria-valuenow={data.Completion}
									/>
								</div>
							</div>
							{data.DueDate === null || data.DueDate === "" ? null : (
								<div
									id="due-time-area"
									className="due-time-area"
									style={{ display: "block" }}
								>
									<div className="due-time-clock-icon">
										<img src={clock} alt="due time red clock" />
									</div>
									<div className="module-due-time-date-area">
										<span id="DueTime" style={{ color: "rgb(241, 86, 86)" }}>
											{date2str(data.DueDate)}
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
