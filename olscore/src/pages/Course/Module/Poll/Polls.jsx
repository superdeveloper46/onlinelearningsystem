import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { toast } from "../../../../libs";
import { Select } from "../../../../components";

import ActivityNav from "../ActivityNav";

import "./Polls.scss";

import {
  getPollResponse,
  postPollResponseSubmit,
} from "../../../../apis/course";
import { readModuleObjective } from "../../../../store/module.slice";

function PageCoursePolls(props) {
  const dispatch = useDispatch();

  const { courseInstanceId, moduleId } = useParams();
  const { activity } = props;
  const [pollQuestions, setPollQuestions] = React.useState([]);
  const [pollResponse, setPollResponse] = React.useState([]);

  const Module = useSelector((store) => store.module);

  const readPollResponse = React.useCallback(() => {
    getPollResponse(
      courseInstanceId,
      Module.ModuleObjectiveId,
      activity.ActivityId
    ).then((data) => {
      setPollQuestions(data.QuestionItems);
      setPollResponse(
        data.QuestionItems.map((question) => {
          if (question.PollAnswers.length > 0) {
            const len = question.PollAnswers.length;
            return {
              submitted: true,
              PollQuestionId: question.PollQuestionId,
              OptionId: question.PollAnswers[len - 1].PollOptionId,
              TextAnswer: question.PollAnswers[len - 1].Answer,
            };
          }
          return {
            submitted: false,
            PollQuestionId: question.PollQuestionId,
            OptionId: -1,
            TextAnswer: "",
          };
        })
      );
    });
  }, [courseInstanceId, Module.ModuleObjectiveId, activity.ActivityId]);

  React.useEffect(() => {
    readPollResponse();
  }, [readPollResponse]);

  const onSubmit = () => {
    if (
      pollResponse.every((item, index) => {
        if (pollQuestions[index].isOption) {
          if (item.OptionId === -1) return false;
        } else {
          if (item.TextAnswer.trim().length === 0) {
            return false;
          }
        }
        return true;
      })
    ) {
      postPollResponseSubmit(
        courseInstanceId,
        Module.ModuleObjectiveId,
        activity.ActivityId,
        pollResponse
      )
        .then(() => {
          readPollResponse();
          dispatch(readModuleObjective({ courseInstanceId, moduleId }));
          toast.success("Great! I have answered all questions on a poll!");
        })
        .catch((err) => {
          toast.error("Sorry! Unknown error is occured");
        });
    } else {
      toast.error(
        "Sorry! You must answer all `text` and `drop-down` questions!"
      );
    }
  };

  return (
    <div className="module-content">
      <div className="step-header d-flex items-center justify-content-between">
        <div className="step-header__left">
          <h2 className="step-header__title">{activity?.Title}</h2>
          <span className="step-header__teacher">Polls</span>
        </div>
        <div className="step-header__right d-flex align-items-center">
          <button
            className="button button-primary me-2 px-6"
            onClick={onSubmit}
          >
            SUBMIT
          </button>
          <ActivityNav {...props}></ActivityNav>
        </div>
      </div>
      <div className="polls-container">
        <Row>
          {pollQuestions?.map((question, index) => (
            <Col xs={12} md={6} lg={4} key={question.PollQuestionId}>
              <div className="poll-item">
                <div className="poll-no"> {index + 1} </div>
                <div className="poll-content">
                  <div className="poll-title">{question.PollQuestion}</div>
                  <div className="poll-answer">
                    {pollResponse[
                      pollResponse.findIndex(
                        (v, i) => v.PollQuestionId === question.PollQuestionId
                      )
                    ]?.submitted && (
                      <div className="submitted-answer">-- Your Reponse --</div>
                    )}
                    {question.PollOptions.length > 0 && (
                      <Select
                        size="lg"
                        value={
                          pollResponse[
                            pollResponse.findIndex(
                              (v, i) =>
                                v.PollQuestionId === question.PollQuestionId
                            )
                          ]?.OptionId
                        }
                        onChange={(e) => {
                          let tmp = [...pollResponse];
                          tmp[
                            tmp.findIndex(
                              (v, i) =>
                                v.PollQuestionId === question.PollQuestionId
                            )
                          ].OptionId = e.target.value;
                          setPollResponse(tmp);
                        }}
                        // disabled={pollResponse[pollResponse.findIndex((v, i) => v.PollQuestionId === question.PollQuestionId)]?.submitted}
                      >
                        <option value="-1" disabled hidden>
                          -- Select Option --
                        </option>
                        {question.PollOptions.map((option) => (
                          <option
                            value={option.PollOptionId}
                            key={option.PollOptionId}
                          >
                            {option.Title}
                          </option>
                        ))}
                      </Select>
                    )}
                    {question.PollOptions.length === 0 && (
                      <textarea
                        rows={5}
                        placeholder="Enter your message"
                        className={"poll-answer__input"}
                        // disabled={pollResponse[pollResponse.findIndex((v, i) => v.PollQuestionId === question.PollQuestionId)]?.submitted}
                        value={
                          pollResponse[
                            pollResponse.findIndex(
                              (v, i) =>
                                v.PollQuestionId === question.PollQuestionId
                            )
                          ]?.TextAnswer
                        }
                        onChange={(e) => {
                          let tmp = [...pollResponse];
                          tmp[
                            tmp.findIndex(
                              (v, i) =>
                                v.PollQuestionId === question.PollQuestionId
                            )
                          ].TextAnswer = e.target.value;
                          setPollResponse(tmp);
                        }}
                      ></textarea>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default PageCoursePolls;
