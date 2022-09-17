import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import CourseSelection from "./components/CourseSelection/CourseSelection";
import CourseObjectives from "./components/CourseObjectives/CourseObjectives";
import Module from "./components/Module/Module";
import Poll from "./components/Module/Poll";
import Quiz from "./components/Quiz/Quiz";
import Assessment from "./components/Module/Assessment";
import Material from "./components/Module/Material";
function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Login />}></Route>
				<Route path="/courses" element={<CourseSelection />}></Route>
				<Route path="/courseobjectives" element={<CourseObjectives />}></Route>
				<Route
					path="/courseobjectives/:courseInstanceId"
					element={<CourseObjectives />}
				></Route>
				<Route path="course/:courseId/module" element={<Module />}></Route>
				<Route
					path="course/:courseId/module/:moduleId"
					element={<Module />}
				></Route>
				<Route
					path="course/:courseId/module/:moduleId/quiz/:questionSetId/"
					element={<Quiz />}
				></Route>
				<Route
					path="course/:courseId/module/:moduleId/poll/:activityId/moduleObjective/:moduleObjectiveId"
					element={<Poll />}
				></Route>
				<Route
					path="course/:courseId/module/:moduleId/assessment/:questionSetId/"
					element={<Assessment />}
				></Route>
				<Route
					path="course/:courseId/module/:moduleId/material/:activityId/"
					element={<Material />}
				></Route>
			</Routes>
		</div>
	);
}

export default App;
