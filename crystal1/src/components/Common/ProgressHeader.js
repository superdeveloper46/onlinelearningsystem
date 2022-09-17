// Header: Title with progress bar (used in Poll and Quiz)
import "../Module/Poll.css";

export default function ModuleHeader(props) {
	return (
		<div className="box module-progress-header">
			<div className="d-flex flex-column flex-md-row">
				<div className="flex-grow-1 module-title text-center text-md-start">
					{props.title}
				</div>
				<div className="flex-grow-0 module-grade mt-4 mt-md-0">
					<div className="d-flex flex-row justify-content-between">
						<div>{props.type}</div>
						<div id="module-grade">{props.percentage}</div>
					</div>
					<div className="progress">
						<div
							id="progress-module-grade"
							className="progress-bar"
							style={{ width: `${props.percentage}` }}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
}
