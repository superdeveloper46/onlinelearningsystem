import axios from "../libs/axios";

export const getCodingProblem = (CourseInstanceId, ModuleObjectiveId, codingProblemId, code = "") => {
  return axios.post("codingproblem", {
    CourseInstanceId,
    ModuleObjectiveId,
    codingProblemId,
    code,
  });
};

export const postRunCode = (CourseInstanceId, codingProblemId, codeStructurePoints, code) => {
  return axios.post("Assignment/RunCode", {
    CourseInstanceId,
    codingProblemId,
    codeStructurePoints,
    code,
  });
};
