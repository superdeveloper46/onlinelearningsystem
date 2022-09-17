import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Module.css";
import { getModuleObjectives } from "../../api/course";
import Materials from "./Materials";
import LoaderSpinner from "../Common/LoaderSpinner";
import ModuleProgress from "./ModuleProgress";
export default function Module() {
	const { courseId, moduleId } = useParams();
	const [moduleObjectives, setModuleObjectives] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sectionNames, setSectionNames] = useState([]);
	useEffect(() => {
		getModuleObjectives(courseId, moduleId)
			.then((res) => {
				setModuleObjectives(res.ModuleObjectives[0]);
				setLoading(false);
			})
			.catch((e) => console.log(e));
	}, [courseId, moduleId]);

	useEffect(() => {
		if (sectionNames.length > 0 || moduleObjectives === null) return;

		if (moduleObjectives.Materials.length > 0)
			setSectionNames((names) => [...names, "Materials"]);
		if (moduleObjectives.Quizzes.length > 0)
			setSectionNames((names) => [...names, "Quizzes"]);
		if (moduleObjectives.Assessments.length > 0)
			setSectionNames((names) => [...names, "Assessments"]);
		if (moduleObjectives.Polls.length > 0)
			setSectionNames((names) => [...names, "Polls"]);
	}, [sectionNames, moduleObjectives]);

	return (
		<section className="page-content">
			<div className="container">
				{moduleObjectives && !loading ? (
					<div className="row">
						<div className="col-sm-12">
							<div className="module-objective">
								<div className="margin-1-r-1">
									<div id="pnlModuleObjectives" className="row">
										<div className="col-sm-12">
											<div className="row">
												<div
													className="col-lg-8 offset-lg-2 col-md-12"
													style={{ padding: 0 }}
												>
													<div>
														{sectionNames.map((name, i) => (
															<div
																className="module-item-content-area"
																style={{ display: "block" }}
																key={i}
															>
																<div className="flex-box">
																	<div className="module-title-area">
																		<div className="module-progress-img-area"></div>
																		<span
																			id={`${moduleId}lbl${module}`}
																			className="module-item-title"
																		>
																			{name}
																		</span>
																	</div>

																	<div className="module-item-content" key={i}>
																		{/*loadContent(name)*/}
																		{name === "Materials" ? (
																			<Materials
																				module={moduleObjectives.Materials}
																				courseId={courseId}
																				moduleId={moduleId}
																				name="material"
																			/>
																		) : name === "Quizzes" ? (
																			<ModuleProgress
																				module={moduleObjectives.Quizzes}
																				courseId={courseId}
																				moduleId={moduleId}
																				name="quiz"
																			/>
																		) : name === "Polls" ? (
																			<ModuleProgress
																				module={moduleObjectives.Polls}
																				courseId={courseId}
																				moduleId={moduleId}
																				name="poll"
																				id={moduleObjectives.Id}
																			/>
																		) : name === "Assessments" ? (
																			<ModuleProgress
																				module={moduleObjectives.Assessments}
																				courseId={courseId}
																				moduleId={moduleId}
																				name="assessment"
																			/>
																		) : null}
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<LoaderSpinner />
				)}
			</div>
		</section>
	);
}
