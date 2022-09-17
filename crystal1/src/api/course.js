import UseFetch from "../components/Common/useFetch";

// Course Selection Page
export const getCourses = () => {
	return UseFetch("Course", { Method: "Get" });
};

export const getGrades = () => {
	return UseFetch("Course", { Method: "Grades" });
};

// Course Objective Page
export const getObjectives = (id) => {
	return UseFetch("CourseObjective", {
		CourseInstanceId: id,
		Method: "GetCourseObjective",
	});
};

export const getObjectivesLoadGrades = (id) => {
	return UseFetch("CourseObjective", {
		CourseInstanceId: id,
		Method: "LoadGrades",
	});
};

// Module Page
export const getModuleObjectives = (courseId, moduleId) => {
	return UseFetch("ModuleObjective", {
		CourseInstanceId: courseId,
		ModuleId: moduleId,
	});
};

// Module Page Materials Column
export const getMaterials = (activityId) => {
	return UseFetch("Activity", {
		ActivityId: activityId,
		Type: "Material",
	});
};

// Quiz
export const getQuiz = (id) => {
	return UseFetch("Material", { QuestionSetId: id, QuestionSetType: "Quiz" });
};
//Quiz Question - reveal, submit, rating
export const submitQuestionRating = (qId, value) => {
	return UseFetch("QuestionRating", {
		QuestionId: qId,
		rating: value,
	});
};
//Quiz Question - reveal, submit, rating
export const submitQuestionAnswer = (control, data, id) => {
	return UseFetch(control, {
		Answer: data.Answer,
		History: data.History,
		Location: data.Location,
		QuestionId: id,
	});
};

export const submitQuestionReveal = (control, id) => {
	return UseFetch(control, { History: "", QuestionId: id });
};

export const getPoll = (courseId, moduleId, activityId, moduleObjectiveId) => {
	return UseFetch("PollResponse", {
		CourseInstanceId: courseId,
		ModuleId: moduleId,
		ModuleObjectiveId: moduleObjectiveId,
		PollGroupId: activityId,
		Method: "Get",
	});
};
