import React from "react";
import thumbup from "../../assets/images/thumb-up-normal.png";
import thumbupSelect from "../../assets/images/thumb-up-selected.png";
import thumbdown from "../../assets/images/thumb-down-normal.png";
import thumbdownSelect from "../../assets/images/thumb-down-selected.png";

export default function Rating({ value, handleRatingChange }) {
	return (
		<div className="align-self-sm-start mb-2 d-none d-md-flex flex-md-row align-items-md-baseline">
			<span className="feedback-label">Feedback:</span>
			<div style={{ height: "100%", width: "0.604rem" }} />
			<img
				src={value === 1 ? thumbupSelect : thumbup}
				alt="rate up"
				className="thumbs-img-icon RateUp"
				onClick={() => handleRatingChange(1)}
			></img>
			<div style={{ height: "100%", width: "0.708rem" }} />
			<img
				src={value === -1 ? thumbdownSelect : thumbdown}
				alt="rate down"
				className="thumbs-img-icon RateDown"
				onClick={() => handleRatingChange(-1)}
			></img>
		</div>
	);
}
