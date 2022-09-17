import React from "react";

export default function LoaderSpinner() {
	return (
		<div
			id="loader-spinner"
			className="loader-img loader-overlay"
			style={{ display: "block" }}
		>
			<img
				src={require("../../assets/images/Loder_Trancparent_bg.gif")}
				alt="loader spinner"
			/>
		</div>
	);
}
