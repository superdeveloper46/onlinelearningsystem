import axios from "../libs/axios";

export const getQuiz = (QuestionSetId) => {
  return axios.post("Material", { QuestionSetId, QuestionSetType: "Quiz" });
};

export const setQuestionRating = (QuestionId, rating) => {
  const Hash = localStorage.getItem("Hash");
  return axios.post("QuestionRating", { QuestionId, rating, StudentId: Hash });
};

export const submitQuestionAnswer = (data) => {
  const Hash = localStorage.getItem("Hash");
  return axios.post("Submit", { StudentId: Hash, ...data });
};

export const setRevealAnswer = (QuestionId, History) => {
  const Hash = localStorage.getItem("Hash");
  return axios.post("Reveal", { QuestionId, History, StudentId: Hash });
};
