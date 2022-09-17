import React, { useEffect, useState } from "react";
import ModuleHeader from "../Common/ProgressHeader";
import "./Poll.css";
import "../../styles/general.css";
import LoaderSpinner from "../Common/LoaderSpinner";
import { getPoll } from "../../api/course";
import { useParams } from "react-router-dom";
function Poll() {
	const { courseId, moduleId, activityId, moduleObjectiveId } = useParams();
	const [title, setTitle] = useState("");
	const [questions, setQuestions] = useState(null);
	const [pollResponses, setPollResponses] = useState([]);
	const [answerCount, setAnswerCount] = useState(0);
	const [length, setLength] = useState(0);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (answerCount === length) alert("form was submitted!");
		else alert(`Sorry! Please answer all 'multiple choice' questions!`);
	};

	const updatePollResponses = (questionId, answer, isOption) => {
		const i = pollResponses.findIndex((x) => x.PollQuestionId === questionId);
		if (i > -1) {
			//Updates response
			const newPollResponse = [...pollResponses];
			if (isOption) {
				newPollResponse[i] = {
					...newPollResponse[i],
					OptionId: answer,
				};
			} else {
				newPollResponse[i] = {
					...newPollResponse[i],
					Answer: answer,
				};
			}
			setPollResponses(newPollResponse);
		} else {
			// Adds new response
			if (isOption) {
				const newPollResponse = [
					...pollResponses,
					{ PollQuestionId: questionId, OptionId: answer },
				];
				setPollResponses(newPollResponse);
				setAnswerCount((prevCount) => prevCount + 1);
			} else {
				const newPollResponse = [
					...pollResponses,
					{ PollQuestionId: questionId, OptionId: null, Answer: answer },
				];
				setPollResponses(newPollResponse);
			}
		}
	};

	useEffect(() => {
		getPoll(courseId, moduleId, activityId, moduleObjectiveId).then((res) => {
			//console.log(res);
			setTitle(res.Title);
			setQuestions(res.QuestionItems);

			res.QuestionItems.map((data) => {
				if (data.isOption) setLength((prev) => prev + 1);
			});
		});
	}, [courseId, moduleId, activityId]);
	return (
		<section className="page-content">
			<div className="container px-xl-4">
				<ModuleHeader title={title} type="Answered" percentage="0%" />
				<div>
					{questions ? (
						<div className="box poll-contents mb-5">
							<form>
								<div id="pnlQuestions">
									{questions.map((q, i) => (
										<PollItem
											key={q.PollQuestionId}
											id={q.PollQuestionId}
											qNum={i + 1}
											question={q.PollQuestion}
											options={q.PollOptions}
											isOption={q.isOption}
											updatePollResponses={updatePollResponses}
											answers={q.PollAnswers}
										></PollItem>
									))}
								</div>{" "}
								<div
									className="d-flex justify-content-end"
									style={{ marginTop: "2rem" }}
								>
									<input
										className="button solid px-4"
										type="submit"
										value="Submit Answers"
										onClick={handleSubmit}
									></input>
								</div>
							</form>
						</div>
					) : (
						<LoaderSpinner />
					)}
				</div>
			</div>
		</section>
	);
}
export default Poll;

function Popup() {
	return <div className="swal2-popup swal2-popup"></div>;
}

function PollItem({
	id,
	qNum,
	question,
	options,
	isOption,
	updatePollResponses,
	answers,
	updateTextAnswer,
}) {
	const [textAnswer, setTextAnswer] = useState("");
	const [ratingValue, setRatingValue] = useState(0);
	const [prevValue, setPrevValue] = useState(false);

	const handleAnswer = (answer) => {
		if (isOption) setRatingValue(answer);
		else setTextAnswer(answer);
		updatePollResponses(id, answer, isOption);
	};

	const getPrevAnswered = () => {
		answers.map((res) => {
			if (isOption) {
				if (res.PollOptionId) {
					setRatingValue(res.PollOptionId);
					setPrevValue(true);
				} else {
					setRatingValue(0);
				}
			} else {
				if (res.Answer) {
					setTextAnswer(res.Answer);
					setPrevValue(true);
				} else {
					setTextAnswer("");
				}
			}
		});
	};

	useEffect(() => {
		getPrevAnswered();
	}, []);
	return (
		<div className="pollitem">
			<div className="pollitem-title">Question {qNum}</div>
			<div className="pollitem-questiontext">{question}</div>

			{isOption ? (
				<div className="answeroption-container">
					<div className="d-flex flex-column align-items-center flex-md-row">
						{options.map((data, i) => (
							<button
								key={data.PollOptionId}
								type="button"
								className={
									`pollanswer-optionitem active ` +
									(ratingValue === data.PollOptionId ? "selected" : "")
								}
								onClick={() =>
									!prevValue ? handleAnswer(data.PollOptionId) : () => false
								}
							>
								{i + 1}
							</button>
						))}
					</div>
					{/* Show worst rating label */}
					<div className="d-flex justify-content-center justify-content-md-between">
						<div className="answeroption-leastlabel d-none d-md-block">
							{options[4].Title}
						</div>
						{/*Show best rating label*/}

						<div className="answeroption-mostlabel d-none d-md-block">
							{options[0].Title}
						</div>
					</div>
				</div>
			) : (
				<div className="answertext-container">
					<div className="textarea-container">
						<textarea
							className="textbox"
							rows="5"
							placeholder="Type Here..."
							value={textAnswer}
							onChange={(e) =>
								!prevValue ? handleAnswer(e.target.value) : () => false
							}
							disabled={prevValue}
						></textarea>
					</div>
				</div>
			)}
		</div>
	);
}
