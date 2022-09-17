import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMaterials } from "../../api/course";

function Material() {
	const { courseId, moduleId, activityId } = useParams();

	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("Redirecting..");
	useEffect(() => {
		getMaterials(activityId)
			.then((res) => {
				window.location.href = res.Description;
				setLoading(false);
			})
			.catch((e) => {
				setMessage("Material not found.");
				console.log("Error loading material link ", e);
			});
	});
	return <div>{loading ? null : null}</div>;
}

export default Material;
