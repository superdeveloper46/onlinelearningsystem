import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Row, Col } from "react-bootstrap";

import clsx from "clsx";
import { utils } from "../../../../libs";
import Icons from "../../../../assets/icons/index";

import ActivityNav from "../ActivityNav";
import Clock from "../components/Clock";

import CodeEditorTab from "./CodeEditorTab";
import { getCodingProblem, postRunCode } from "../../../../apis/assignment";

import "./Assignment.scss";

const getOutputData = (codingProblem, d) => {
  let testCases = d.Tests;
  // let exReMess = d.ExeResult.TestCodeMessages;
  let g_Language = codingProblem.Language;

  let error = "",
    bSuccessCode = false,
    bSuccessExe = false,
    outputExecution = "";
  if (
    g_Language === "C#" ||
    g_Language === "Java" ||
    g_Language === "Cpp" ||
    g_Language === "AzureDO" ||
    g_Language === "REST" ||
    g_Language === "Browser" ||
    g_Language === "R" ||
    g_Language === "WebVisitor" ||
    g_Language === "CosmoDB" ||
    g_Language === "Python"
  ) {
    if (!d.ExeResult.Compiled) {
      if (d.ExeResult.Message != null) {
        for (let i = 0; i < d.ExeResult.Message.length; i++) {
          error += d.ExeResult.Message[i] + "<br/>";
        }
      }
      if (d.codeHints != null) {
        for (let i = 0; i < d.CodeHints.length; i++) {
          error += d.CodeHints[i].Error + "<br/>";
        }
      }
    } else {
      error = "Compilation Successful";
    }
  } else if (g_Language === "SQL" || g_Language === "DB") {
    error = testCases[0].ActualErrors.join(String.fromCharCode(13, 10));
  } else {
    error =
      (d.ExMessage ? d.ExMessage + "<br/>" : "") +
      (d.ExeResult && d.ExeResult.ExMessage
        ? d.ExeResult.ExMessage + "<br/>"
        : "") +
      (d.ExeResult && d.ExeResult.ErrorList
        ? d.ExeResult.ErrorList + "<br/>"
        : "") +
      (d.ExeResult && d.ExeResult.Succeeded === false && d.ExeResult.Output
        ? d.ExeResult.Output
        : "");
  }

  if (d.ExeResult) {
    if (typeof d.ExeResult.Compiled != "undefined")
      bSuccessCode = d.ExeResult.Compiled;

    if (typeof d.Tests == "object" && d.Tests.length > 0) {
      bSuccessExe = true;
      for (var i = 0; i < d.Tests.length; i++) {
        if (d.Tests[i].Passed !== true) {
          bSuccessExe = false;
          break;
        }
      }
    } else {
      bSuccessExe =
        d.GradeTable.TestsGrade === d.GradeTable.TestsWeight ? true : false;
    }

    if (d.ExeResult.Compiled && d.ExeResult.Succeeded) {
      if (typeof d.ExeResult.Output != "undefined")
        outputExecution = d.ExeResult.Output;
    } else {
      if (d.ExeResult.Message != null) {
        for (let i = 0; i < d.ExeResult.Message.length; i++) {
          outputExecution += d.ExeResult.Message[i] + "<br/>";
        }
      }
    }
  }
  if (bSuccessExe) outputExecution = "Execution Successful";

  let strCodeOutput = utils.fixStringNewline(error);
  let strExecutionOutput = utils.fixStringNewline(outputExecution);

  return {
    clsCode: bSuccessCode,
    clsExecution: bSuccessExe,
    strCodeOutput,
    strExecutionOutput,
  };
};

function PageAssignment({ activity, activities }) {
  const { courseInstanceId } = useParams();
  const Module = useSelector((store) => store.module);

  const [tabKey, setTabKey] = React.useState("instructions");
  const [codingProblem, setCodingProblem] = React.useState({});
  const [RunCodeResult, setRunCodeResult] = React.useState(null);
  const [outputData, setOutputData] = React.useState(null);

  React.useEffect(() => {
    getCodingProblem(
      courseInstanceId,
      Module.ModuleObjectiveId,
      activity.ActivityId
    ).then((res) => {
      setCodingProblem(res);
      setRunCodeResult(null);
      setOutputData(null);
    });
  }, [courseInstanceId, Module.ModuleObjectiveId, activity]);

  const onCodeSubmit = (code) => {
    setTabKey("output");
    postRunCode(courseInstanceId, activity.ActivityId, 0, code).then((res) => {
      setRunCodeResult(res);
      setCodingProblem({
        ...codingProblem,
        last: res.last,
        submissions: res.Submissions,
        grade: res.BestGrade,
      });
      setOutputData(getOutputData(codingProblem, res));
    });
  };

  return (
    <div className="module-content">
      <div className="step-header d-flex items-center justify-content-between">
        <div className="step-header__left">
          <h2 className="step-header__title">{activity?.Title}</h2>
          <span className="step-header__teacher">
            {activity?.type} {activity?.index}
          </span>
        </div>
        <div className="step-header__right d-flex align-items-center">
          <Clock date={utils.getDueDateString(codingProblem?.dueDate)}></Clock>
          <div className="grade d-flex flex-column mx-3">
            <span className="grade-name">Best Grade</span>
            <span className="grade-value">
              {parseInt(codingProblem?.grade)}/100
            </span>
          </div>
          <div className="grade d-flex flex-column mx-3">
            <span className="grade-name">Submissions</span>
            <span className="grade-value">
              <span className="text-red">
                {parseInt(codingProblem?.submissions)}
              </span>
              /{codingProblem?.Attempts}
            </span>
          </div>
          <ActivityNav
            activities={activities}
            activity={activity}
          ></ActivityNav>
        </div>
      </div>
      <div className="assignment-content">
        <Row>
          <Col md={12} lg={5}>
            <div className="assignment-detail">
              <Tabs
                activeKey={tabKey}
                onSelect={(k) => setTabKey(k)}
                className="mb-3 nav-line-tabs"
              >
                <Tab eventKey="instructions" title="Instructions">
                  <div
                    className="instruction"
                    dangerouslySetInnerHTML={{
                      __html: codingProblem?.Instructions,
                    }}
                  ></div>
                </Tab>
                <Tab eventKey="output" title="Output">
                  <span className="output-header"> Code </span>
                  <pre
                    className={clsx("output-body", {
                      success: outputData?.clsCode,
                      error: !outputData?.clsCode,
                    })}
                    dangerouslySetInnerHTML={{
                      __html: outputData?.strCodeOutput,
                    }}
                  ></pre>
                  <span className="output-header"> Execution </span>
                  <pre
                    className={clsx("output-body", {
                      success: outputData?.clsExecution,
                      error: !outputData?.clsExecution,
                    })}
                    dangerouslySetInnerHTML={{
                      __html: outputData?.strExecutionOutput,
                    }}
                  ></pre>
                  <button
                    className="button button-primary px-4"
                    style={{
                      position: "absolute",
                      bottom: 24,
                    }}
                  >
                    <Icons.Action.Download></Icons.Action.Download> DOWNLOAD
                    TEST
                  </button>
                </Tab>
                <Tab eventKey="feedback" title="Feedback">
                  <span className="output-header"> Code </span>
                  <pre className="output-body success">
                    Compilation Successful
                  </pre>
                  <span className="output-header"> Execution </span>
                  <pre className="output-body error"></pre>
                  <button className="button button-primary px-4">
                    <Icons.Action.Download></Icons.Action.Download> DOWNLOAD
                    TEST
                  </button>
                </Tab>
              </Tabs>
            </div>
          </Col>
          <Col md={12} lg={7}>
            <CodeEditorTab
              codingProblem={codingProblem}
              RunCodeResult={RunCodeResult}
              onSubmit={onCodeSubmit}
            ></CodeEditorTab>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PageAssignment;
