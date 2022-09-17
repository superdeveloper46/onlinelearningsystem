import React, { useEffect, useState } from "react";
import "./Question.css";
import {
	GradableTextBox,
	RevealElement,
	checkAnswer,
	isAnswerExact,
} from "./Answer";
import UseFetch from "../Common/useFetch";
import Rating from "./Rating";
import { submitQuestionAnswer, submitQuestionRating } from "../../api/course";

const Question = ({
	qId,
	grade,
	maxGrade,
	questionNum,
	prompt1,
	prompt2,
	ans,
	expectedAns,
	type,
	ansShown,
	caseSens,
	rating,
	submitAnswer,
}) => {
	const [newAns, setNewAns] = useState("");
	const [ansHistory, setAnsHistory] = useState("");
	const [ansStatus, setAnsStatus] = useState(""); // revealed,correct,""

	useEffect(() => {
		function checkHistory() {
			let answerStatus = checkAnswer(ansShown, ans, expectedAns, caseSens);
			setAnsStatus(answerStatus);
		}
		checkHistory();
	}, [ansShown, ans, expectedAns, caseSens]);

	// Confirm dialog to reveal answer
	const handleRevealChange = () => {
		if (
			window.confirm(
				"Revealing the answer will deduct points from your grade.  Are you sure you wish to reveal the answer?"
			)
		)
			setAnsStatus("revealed"); // change reveal status - show expected answer if user confirms message.
		submitAnswer("Reveal", { History: "" }, 0, qId);
	};

	// Checks answer on user input change
	const handleAnsChange = (e, maxGrade) => {
		let input = e.target.value;
		let isCorrect = isAnswerExact(input, expectedAns, caseSens);

		if (isCorrect) {
			setNewAns(input);
			setAnsStatus("correct"); // updates answer status for styling
			submitAnswer(
				"Submit",
				{ Answer: input, Location: window.location.href, History: "" },
				maxGrade,
				qId
			);
			console.log("inside change handler: " + newAns);
		} else {
			setNewAns(input);
		}
	};

	return (
		<>
			<QuestionHeader
				qId={qId}
				questionNum={questionNum}
				grade={grade} // Updates grade when answer is correct
				maxGrade={maxGrade}
				ansShown={ansShown}
				caseSens={caseSens}
				ans={ans}
				expectedAns={expectedAns}
				isCorrect={handleAnsChange}
				ansStatus={ansStatus}
				handleRevealChange={handleRevealChange}
				rating={rating}
			/>
			<div className="gradable-question-area">
				<span id="prompt1">{prompt1}</span>
				<GradableTextBox
					qId={qId}
					ans={ans}
					expectedAns={expectedAns}
					ansShown={ansShown}
					grade={grade}
					caseSens={caseSens}
					isCorrect={handleAnsChange}
					newAns={newAns}
					ansHistory={ansHistory}
					ansStatus={ansStatus}
					maxGrade={maxGrade}
				></GradableTextBox>
				<span id="prompt2">{prompt2}</span>
			</div>
		</>
	);
};

// Displays question number, points earned / max points, reveal answer and feedback rating
function QuestionHeader({
	qId,
	questionNum,
	grade,
	maxGrade,
	ansShown,
	ans,
	expectedAns,
	caseSens,
	updateShown,
	ansStatus,
	handleRevealChange,
	rating,
}) {
	const [value, setValue] = useState(rating);

	const handleRatingChange = (newValue) => {
		if (value === newValue) setValue(0);
		// reset to default 0 rating
		else if (value === 1 && newValue === -1) setValue(-1);
		// switch from thumbs up to thumbs down
		else if (value === -1 && newValue === 1)
			setValue(1); //switch from thumbs down to thumb up
		else setValue(value + newValue); // select thumbs up or thumb down
	};

	useEffect(() => {
		if (value === rating) return;

		const sendRating = () => {
			submitQuestionRating(qId, value)
				.then(() => {}) // No response after updating
				.catch((e) => {});
		};
		sendRating();
	}, [value, rating, qId]);

	return (
		<div className="d-flex flex-column mb-3 flex-md-row justify-content-md-between">
			<div className="d-flex flex-column flex-md-row">
				<div className="d-flex flex-column align-items-center mb-0 flex-sm-row justify-content-sm-between align-items-sm-start mb-sm-2 align-items-md-center mb-md-0">
					<div id="question-title" className="question-title mb-2 mb-sm-0">
						Question {questionNum}
					</div>
				</div>
				<div className="d-flex flex-column align-items-center flex-sm-row justify-content-center">
					<div
						id="question-points"
						className="question-points m1-0 mb-2 ms-md-3 mb-sm-0"
					>
						{grade} / {maxGrade} Points
					</div>
					<RevealElement
						ansShown={ansShown}
						ans={ans}
						expAns={expectedAns}
						caseSens={caseSens}
						updateShown={updateShown}
						ansStatus={ansStatus}
						handleRevealChange={handleRevealChange}
					></RevealElement>
				</div>
			</div>
			<Rating value={value} handleRatingChange={handleRatingChange} />
		</div>
	);
}

export default Question;
