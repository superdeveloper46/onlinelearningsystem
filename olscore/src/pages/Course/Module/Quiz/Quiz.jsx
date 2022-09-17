import * as React from "react";
import { Row, Col } from "react-bootstrap";

import { getQuiz } from "../../../../apis/quiz";

import ActivityNav from "../ActivityNav";
import Clock from "../components/Clock";

import Question from "./Question";

import "./Quiz.scss";

function PageQuiz(props) {
  const { activity } = props;
  const [quiz, setQuiz] = React.useState({});

  React.useEffect(() => {
    getQuiz(activity.ActivityId).then((data) => {
      data.QuizQuestions = data.QuizQuestions.sort((a, b) => a.Id - b.Id).map(
        (question, index) => ({
          ...question,
          No: index + 1,
        })
      );
      setQuiz(data);
    });
  }, [activity.ActivityId]);

  return (
    <div className="module-content">
      <div
        className="step-header d-flex items-center justify-content-between"
        style={{ borderBottom: "1px solid #D9D9D9" }}
      >
        <div className="step-header__left">
          <h2 className="step-header__title">{activity?.Title}</h2>
          <span className="step-header__teacher">
            {activity?.type} {activity?.index}
          </span>
        </div>
        <div className="step-header__right d-flex align-items-center">
          <Clock></Clock>
          <div className="grade d-flex flex-column mx-3">
            <span className="grade-name">Best Grade</span>
            <span className="grade-value">
              {quiz?.QuizQuestions?.length > 0
                ? parseInt(
                    (quiz?.QuizQuestions?.reduce((s, c) => (s += c.Grade), 0) *
                      100) /
                      quiz?.QuizQuestions?.reduce(
                        (s, c) => (s += c.MaxGrade),
                        0
                      )
                  )
                : 0}
              /100
            </span>
          </div>
          <div className="grade d-flex flex-column mx-3">
            <span className="grade-name">Revealed</span>
            <span className="grade-value">
              <span className="text-red">
                {quiz?.QuizQuestions?.length > 0
                  ? parseInt(
                      (quiz?.QuizQuestions?.filter((q) => q.AnswerShown)
                        .length *
                        100) /
                        quiz?.QuizQuestions?.length
                    )
                  : 0}
              </span>
              /100
            </span>
          </div>
          <ActivityNav {...props}></ActivityNav>
        </div>
      </div>
      <div className="activity-content">
        <Row>
          <Col md={12} xl={6}>
            {quiz?.QuizQuestions?.slice(
              0,
              quiz?.QuizQuestions?.length / 2 + (quiz.QuizQuestions?.length % 2)
            ).map((question) => (
              <Question
                question={question}
                key={question.Id}
                onChange={(question, q = {}) => {
                  setQuiz({
                    ...quiz,
                    ...q,
                    QuizQuestions: quiz.QuizQuestions.map((q) => {
                      if (q.Id !== question.Id) return q;
                      return question;
                    }),
                  });
                }}
              ></Question>
            ))}
          </Col>
          <Col md={12} xl={6}>
            {quiz?.QuizQuestions?.slice(-(quiz?.QuizQuestions?.length / 2)).map(
              (question) => (
                <Question
                  question={question}
                  key={question.Id}
                  onChange={(question, q = {}) => {
                    setQuiz({
                      ...quiz,
                      ...q,
                      QuizQuestions: quiz.QuizQuestions.map((q) => {
                        if (q.Id !== question.Id) return q;
                        return question;
                      }),
                    });
                  }}
                ></Question>
              )
            )}
          </Col>
        </Row>
        {/* <Row>
          <Col md={12} xl={6}>
            <div className="quiz-item">
              <div className="quiz-no"> 1 </div>
              <div className="quiz-content">
                <div className="quiz-question">
                  Enim sed vitae cursus id orci in in. Leo aliquet quam ultrices nisl tortor, non convallis. Massa faucibus sed nisi auctor placerat tellus quisque libero.
                </div>
                <div className="quiz-answer quiz-answer-success">Structure</div>
                <div className="quiz-actions d-flex">
                  <LikeButton className="me-2"></LikeButton>
                  <LikeButton like={false}></LikeButton>
                </div>
              </div>
            </div>
            <div className="quiz-item">
              <div className="quiz-no"> 2 </div>
              <div className="quiz-content">
                <div className="quiz-question">
                  Enim sed vitae cursus id orci in in. Leo aliquet quam ultrices nisl tortor, non convallis. Massa faucibus sed nisi auctor placerat tellus quisque libero.
                </div>
                <div className="quiz-answer">
                  <input type="text" placeholder="Your Answer" /> <button className="button button-outline button-sm"> REVEAL </button>
                </div>
                <div className="quiz-actions d-flex">
                  <LikeButton className="me-2"></LikeButton>
                  <LikeButton like={false}></LikeButton>
                </div>
              </div>
            </div>
          </Col>
        </Row>{" "} */}
      </div>
    </div>
  );
}

export default PageQuiz;
