import React from "react";

// text box question type
export function GradableTextBox({
	expectedAns,
	isCorrect,
	newAns,
	ansHistory,
	ansStatus,
	maxGrade,
}) {
	return (
		<div
			id="textbox"
			className="gradeable-textbox-area"
			style={{ position: "relative", display: "inline-block" }}
		>
			{ansStatus === "correct" || ansStatus === "revealed" ? (
				<input
					className={`gradeable-textbox ${ansStatus}`}
					type="text"
					readOnly
					value={expectedAns}
				></input>
			) : (
				<input
					className={`gradeable-textbox ${ansStatus}`}
					type="text"
					value={newAns}
					style={{ minWidth: "2.5rem" }}
					onChange={(e) => isCorrect(e, maxGrade)}
				></input>
			)}
		</div>
	);
}

// check answer if revealed or correct input- used for styling input
export function checkAnswer(shown, ans, expAns, caseSens) {
	const answerRevealed = shown;
	const alreadyAnswered = isAnswerExact(ans, expAns, caseSens); // from Question.js
	if (answerRevealed) {
		return "revealed"; // User revealed answer
	} else if (alreadyAnswered) {
		return "correct"; // User entered correct answer
	} else {
		return ""; // Normal input
	}
}

// check case sensitivity
export function isAnswerExact(ans, expAns, caseSens) {
	if (caseSens) {
		return ans === expAns;
	} else {
		return ans.trim().toLowerCase() === expAns.trim().toLowerCase();
	}
}

// shows correct or revealed answer, or button option to reveal the answer.
export function RevealElement({
	ansShown,
	ans,
	expAns,
	caseSens,
	ansStatus,
	handleRevealChange,
}) {
	const svgCorrect = (
		<>
			<svg
				width="15"
				height="12"
				viewBox="0 0 15 12"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0.9375 6.3125L5.3125 10.6875L14.0625 1.3125"
					stroke="#7DC237"
					strokeWidth="1.875"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>{" "}
			<div style={{ marginLeft: ".5em" }}>Correct Answer</div>
		</>
	);
	const svgRevealed = (
		<>
			<svg
				width="11"
				height="10"
				viewBox="0 0 11 10"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.5625 0.9375L1.4375 9.0625M1.4375 0.9375L9.5625 9.0625"
					stroke="#ECAD0F"
					strokeWidth="1.875"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<div style={{ marginLeft: ".5em" }}>Answer Revealed</div>
		</>
	);

	const svgReveal = (
		<>
			<svg
				width="13"
				height="14"
				viewBox="0 0 13 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5.03938 10.125H7.96M6.5 1.375V2M10.4775 3.0225L10.0356 3.46437M12.125 7H11.5M1.5 7H0.875M2.96437 3.46437L2.5225 3.0225M4.29 9.21C3.85304 8.77293 3.5555 8.2161 3.43499 7.60994C3.31447 7.00377 3.37641 6.37548 3.61296 5.80451C3.8495 5.23354 4.25004 4.74553 4.76393 4.40218C5.27781 4.05884 5.88197 3.87558 6.5 3.87558C7.11803 3.87558 7.72219 4.05884 8.23607 4.40218C8.74996 4.74553 9.1505 5.23354 9.38705 5.80451C9.62359 6.37548 9.68553 7.00377 9.56501 7.60994C9.4445 8.2161 9.14696 8.77293 8.71 9.21L8.3675 9.55188C8.17169 9.74772 8.01638 9.98021 7.91043 10.2361C7.80448 10.492 7.74996 10.7662 7.75 11.0431V11.375C7.75 11.7065 7.6183 12.0245 7.38388 12.2589C7.14946 12.4933 6.83152 12.625 6.5 12.625C6.16848 12.625 5.85054 12.4933 5.61612 12.2589C5.3817 12.0245 5.25 11.7065 5.25 11.375V11.0431C5.25 10.4837 5.0275 9.94688 4.6325 9.55188L4.29 9.21Z"
					stroke="#F15656"
					strokeWidth="1.66667"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			{"  "}
			<div style={{ marginLeft: ".5em" }}>Reveal Answer</div>
		</>
	);

	if (ansStatus === "")
		ansStatus = checkReveal(ansShown, ans, expAns, caseSens);

	return (
		<div
			id="btnReveal"
			className={`reveal-answer ms-0 ms-sm-3 ${ansStatus}`}
			onClick={() => {
				handleRevealChange();
			}}
		>
			{ansStatus === "revealed"
				? svgRevealed
				: ansStatus === "correct"
				? svgCorrect
				: ansStatus === "reveal"
				? svgReveal
				: null}
		</div>
	);
}

export function checkReveal(ansShown, ans, expAns, caseSens) {
	const answerRevealed = ansShown;
	const alreadyAnswered = isAnswerExact(ans, expAns, caseSens);
	if (answerRevealed) {
		return "revealed"; // Revealed
	} else {
		if (alreadyAnswered) {
			return "correct"; // Answered without being revealed
		} else {
			return "reveal"; // Option to reveal answer
		}
	}
}
