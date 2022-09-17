import * as React from "react";

import { OlsLoader } from "../../../../components/loader/index";
import { getPollResponse } from "../../../../apis/course";

import ActivityNav from "../ActivityNav";
import Clock from "../components/Clock";

import { ReactComponent as IconChecked } from "./icons/checked.svg";
import { ReactComponent as IconUnchecked } from "./icons/unchecked.svg";

import "./Polls.scss";

function PageCoursePolls(props) {
  const { activity } = props;
  const [pollQuestions, setPollQuestions] = React.useState({});
  const [curIndex, setCurIndex] = React.useState(0);
  const [question, setQuestion] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getPollResponse(activity.ActivityId).then((data) => {
      setPollQuestions(data);
      setLoading(false);
    });
  }, [activity.ActivityId]);

  React.useEffect(() => {
    setQuestion(pollQuestions[curIndex]);
  }, [curIndex, pollQuestions]);

  if (isLoading) return <OlsLoader></OlsLoader>;

  return (
    <div className="module-content">
      <div className="step-header d-flex items-center justify-content-between">
        <div className="step-header__left">
          <h2 className="step-header__title">{activity?.Title}</h2>
          <span className="step-header__teacher">Polls</span>
        </div>
        <div className="step-header__right d-flex align-items-center">
          <Clock></Clock>
          <ActivityNav {...props}></ActivityNav>
        </div>
      </div>
      <div className="polls-container">
        <div className="polls-progress">
          <span className="polls-active"></span>
          <span className="polls-active"></span>
          <span className="polls-active"></span>
          <span className="polls-active"></span>
          <span className="polls-active"></span>
          <span className="polls-active"></span>
          <span className="polls-active"></span>
          <span className="polls-inactive"></span>
          <span className="polls-inactive"></span>
          <span className="polls-inactive"></span>
        </div>
        <div className="polls-dialog mb-5">
          <div className="dialog-header">
            <span className="dialog-header__title">Student Satisfaction Survey</span>
            <span className="dialog-header__progress">
              <span className="status me-2">
                {curIndex + 1} of {pollQuestions.length} Progress
              </span>
              <div className="progress" style={{ height: 24, width: 200 }}>
                <div role="progressbar" className="progress-bar bg-primary" style={{ width: `${parseInt(((curIndex + 1) * 100) / pollQuestions.length)}%` }}>
                  {parseInt(((curIndex + 1) * 100) / pollQuestions.length)} %
                </div>
              </div>
            </span>
          </div>
          <div className="dialog-body">
            <span className="status">{pollQuestions.length - curIndex} ANSWER LEFT</span>
            <div className="poll-question">{question?.PollQuestion}</div>
            <div className="poll-options">
              {question &&
                question.PollOptions.length > 0 &&
                question.PollOptions.map((option) => (
                  <div className="poll-option" key={option.PollOptionId}>
                    <IconUnchecked></IconUnchecked> {option.Title}
                  </div>
                ))}
              {question && question.PollOptions.length === 0 && <textarea rows={5} className="w-100 mb-4"></textarea>}
              {/* <div className="poll-option">
                <IconUnchecked></IconUnchecked> Never
              </div>
              <div className="poll-option selected">
                <IconChecked></IconChecked> Sometimes
              </div>
              <div className="poll-option">
                <IconUnchecked></IconUnchecked>Always
              </div> */}
            </div>
            <div className="polls-action d-flex justify-content-end ">
              <button
                className="button button-primary"
                onClick={() => {
                  if (curIndex < pollQuestions.length - 1) setCurIndex(curIndex + 1);
                }}
              >
                NEXT QUESTION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageCoursePolls;
