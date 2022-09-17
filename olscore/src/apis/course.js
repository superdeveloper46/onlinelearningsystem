import axios from "../libs/axios";

// Get Course List without Total Completion / Total Grade
export const getCourse = () => {
  const AdminHash = localStorage.getItem("AdminHash");
  if (AdminHash) {
    return axios.post(`Course`, { Method: "Get", AdminHash, IsAdmin: "true" });
  }

  return axios.post(`Course`, { Method: "Get" });
};

export const getStudentInfo = (SelectedStudentId) => {
  const AdminHash = localStorage.getItem("AdminHash");
  return axios.post(`Course`, { Method: "NavigateStudent", SelectedStudentId, AdminHash, IsAdmin: "true" });
};

export const getGrades = () => {
  const AdminHash = localStorage.getItem("AdminHash");
  if (AdminHash) {
    return axios.post(`Course`, { Method: "Grades", AdminHash, IsAdmin: "true" });
  }
  return axios.post(`Course`, { Method: "Grades" });
};

export const getCourseObjective = (courseInstanceID) => {
  return axios.post(`CourseObjective`, { Method: "GetCourseObjective", CourseInstanceId: courseInstanceID });
};

export const getCourseObjectiveLoadGrades = (CourseInstanceId) => {
  return axios.post(`CourseObjective`, { Method: "LoadGrades", CourseInstanceId });
};

export const getModuleObjective = (CourseInstanceId, ModuleId) => {
  return axios.post(`ModuleObjective`, { CourseInstanceId, ModuleId });
};

export const getBreadCrumb = (CourseInstanceId, ModuleId) => {
  return axios.post(`Breadcrumb`, { CourseInstanceId, ModuleId });
};

export const getActivity = (Type, ActivityId) => {
  return axios.post(`Activity`, { Type, ActivityId });
};

export const getSyllabus = (CourseInstanceId) => {
  return axios.post("Syllabus", { CourseInstanceId });
};

export const getPollResponse = (courseInstanceId, ModuleObjectiveId, PollGroupId) => {
  return axios.post("PollResponse", { courseInstanceId, ModuleObjectiveId, PollGroupId, Method: "Get" });
};

export const postPollResponseSubmit = (CourseInstanceId, ModuleObjectiveId, PollGroupId, Response) => {
  return axios.post("PollResponse", {
    CourseInstanceId,
    ModuleObjectiveId,
    PollGroupId,
    StudentResponses: Response,
    Method: "Add",
  });
};
