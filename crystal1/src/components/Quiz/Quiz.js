import React, { useState, useEffect } from "react";
import "../../styles/general.css";
import "./Quiz.css";
import { useParams } from "react-router-dom";
import Question from "./Question";
import { getQuiz } from "../../api/course";
import LoaderSpinner from "../Common/LoaderSpinner";
import { submitQuestionAnswer } from "../../api/course";
import ProgressHeader from "../Common/ProgressHeader";
/*const QuizHeader = ({ title, grade }) => {
	return (
		<div className="box quiz-header">
			<div className="d-flex flex-column flex-md-row">
				<div
					id="quiz-title"
					className="flex-grow-1 quiz-title text-center text-md-start"
				>
					{title}
				</div>
				<div className="flex-grow-0 quiz-grade mt-4 mt-md-0">
					<div className="d-flex flex-row justify-content-between">
						<div>Grade</div>
						<div id="quiz-grade">{grade}</div>
					</div>
					<div className="progress">
						<div
							id="progress-quiz-grade"
							className="progress-bar"
							style={{ width: `${grade}` }}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};*/

export default function Quiz() {
	const { courseId, moduleId, questionSetId } = useParams();
	const [questions, setQuestions] = useState(null);
	const [totalGrade, setTotalGrade] = useState(null);
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(true);
	const [grade, setGrade] = useState(0); //question grade
	const [ans, setAns] = useState("");
	const [updatedShown, setUpdatedShown] = useState("");

	useEffect(() => {
		getQuiz(questionSetId)
			.then((res) => {
				setQuestions(res.QuizQuestions);
				setTitle(res.Title);
				setTotalGrade(res.TotalGrade + "%");
				setLoading(false);
			})
			.catch((e) => console.log("Error getting questions: ", e));
	}, [courseId, moduleId, questionSetId]);

	// submit revealed or correct answer
	const submitAnswer = (control, data, points, qId) => {
		submitQuestionAnswer(control, data, qId)
			.then((res) => {
				setTotalGrade(res.TotalGrade);
				setGrade(points);
			})
			.catch((e) => console.log(e));
	};

	return (
		<section className="page-content">
			{questions && !loading ? (
				<div className="container px-xl-4">
					<div className="row">
						<div>
							<ProgressHeader
								title={title}
								type="Grade"
								percentage={totalGrade}
							/>
						</div>
						<div>
							<div className="box quiz-contents">
								<div id="pnlQuestions">
									{questions.map((q, i) => (
										<div className="quiz-set" key={q.Id}>
											<Question
												key={q.Id}
												qId={q.Id}
												grade={!grade ? q.Grade : 2}
												maxGrade={q.MaxGrade}
												questionNum={i + 1}
												prompt1={q.Prompt1}
												prompt2={q.Prompt2}
												ans={q.Answer}
												expectedAns={q.ExpectedAnswer}
												type={q.Type}
												//ansShown={ansShown ? ansShown : q.AnswerShown}
												ansShown={q.AnswerShown}
												caseSens={q.CaseSens}
												rating={q.QuestionRating}
												submitAnswer={submitAnswer}
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<LoaderSpinner />
			)}
		</section>
	);
}
