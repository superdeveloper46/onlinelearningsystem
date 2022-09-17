import React, { useEffect, useState } from "react";
import { getMaterials } from "../../api/course";
import { Link } from "react-router-dom";
export default function Materials({ module, courseId, moduleId, name }) {
	return (
		<div id="lstMaterials">
			{module.map((material) => (
				<div className="module-o-card" key={material.ActivityId}>
					<div className="row margin-0">
						<div className="col padding-0">
							<Link
								to={`/course/${courseId}/module/${moduleId}/${name}/${material.ActivityId}`}
								target="_blank"
								className="btn btn-sm m-card-btn"
							>
								<span>{material.Title}</span>
							</Link>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
