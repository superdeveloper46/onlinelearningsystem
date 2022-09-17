import * as React from "react";
import LikeButton from "../../../../components/buttons/LikeButton";
import { toast, dialogs } from "../../../../libs";
import { OlsLoader } from "../../../../components/loader";
import { setQuestionRating, setRevealAnswer, submitQuestionAnswer } from "../../../../apis/quiz.js";
import ContentEditable from "react-contenteditable";

function Question(props) {
  const [isLoading, setLoading] = React.useState(false);
  const { question } = props;
  const [answer, setAnswer] = React.useState("");
  const [coloredAnswer, setColoredAnswer] = React.useState("");

  const formRef = React.useRef(null);

  React.useEffect(() => {
    setAnswer(question.Answer);
  }, [question.Answer]);
  //Reveal Answer
  const revealAnswer = () => {
    dialogs
      .confirm("Revealing the answer will deduct points from your grade. Are you sure you wish to reveal the answer?")
      .then(() => {
        setRevealAnswer(question.Id, "")
          .then((res) => {
            props.onChange({
              ...question,
              AnswerShown: true,
              Answer: res.Answer,
              Grade: 0,
            });
            toast.warning("You revealed answer of a question");
          })
          .catch(() => {});
      });
  };

  const rateQuestion = (rating) => {
    setQuestionRating(question.Id, rating).then((res) => {
      if (res === "") {
        props.onChange({ ...question, QuestionRating: rating });
        toast.success("You rated a question.");
      } else {
        toast.error(res);
      }
    });
  };

  const getColoredAnswer = React.useCallback(
    (t) => {
      const expected = question.ExpectedAnswer;
      return t
        .split("")
        .map((ch, index) => {
          if (expected[index] && ch.toUpperCase() === expected[index].toUpperCase()) {
            return `<span style="color: #27ae60;">${ch}</span>`;
          }
          return `<span style="color: #eb5757;">${ch}</span>`;
        })
        .join("");
    },
    [question.ExpectedAnswer]
  );

  React.useEffect(() => {
    if (answer.toLowerCase() === question.ExpectedAnswer.toLowerCase()) {
      if (question.Grade === 0 && question.AnswerShown === false) {
        setLoading(true);
        submitQuestionAnswer({
          QuestionId: question.Id,
          Answer: answer,
          History: "",
        }).then((res) => {
          toast.success("You solved a question.");
          props.onChange(
            { ...question, Answer: answer, Grade: res.Grade },
            { TotalGrade: res.TotalGrade, TotalShown: res.TotalShown }
          );
          setAnswer("");
          setLoading(false);
        });
      }
    } else {
      setColoredAnswer(getColoredAnswer(answer));
    }
  }, [answer, getColoredAnswer, question, props]);

  if (isLoading) return <OlsLoader />;

  return (
    <div className="quiz-item" key={question.Id}>
      <div className="quiz-no"> {question.No} </div>
      <div className="quiz-content">
        <div className="quiz-question">
          {question.Prompt1}
          <span className="px-2">{`_`.repeat(question.ExpectedAnswer.length)}</span>
          {question.Prompt2}
        </div>
        {question.AnswerShown === true && <div className="quiz-answer quiz-answer-revealed">{question.Answer}</div>}
        {question.Grade === question.MaxGrade && (
          <div className="quiz-answer quiz-answer-success">{question.Answer}</div>
        )}
        {question.AnswerShown === false && question.Grade !== question.MaxGrade && (
          <div className="quiz-answer">
            {/* <input type="text" placeholder="Your Answer" value={answer} onChange={onChange} /> */}
            <ContentEditable
              className="quiz-answer-editor"
              spellCheck={false}
              innerRef={formRef}
              html={coloredAnswer}
              placeholder="Your Answer"
              onChange={(e) => {
                setAnswer(formRef.current.innerText);
              }}
            />
            <button className="button button-outline button-primary button-sm" onClick={revealAnswer}>
              REVEAL
            </button>
          </div>
        )}
        <div className="quiz-actions d-flex align-items-center">
          <LikeButton
            className="me-2"
            liked={question.QuestionRating > 0}
            onClick={() => (question.QuestionRating > 0 ? rateQuestion(0) : rateQuestion(1))}
          ></LikeButton>
          <LikeButton
            like={false}
            liked={question.QuestionRating < 0}
            onClick={() => (question.QuestionRating < 0 ? rateQuestion(0) : rateQuestion(-1))}
          ></LikeButton>
          <span className="quiz-point ms-4">
            {question.Grade} / {question.MaxGrade} Points
          </span>
        </div>
      </div>
    </div>
  );
}

export default Question;
