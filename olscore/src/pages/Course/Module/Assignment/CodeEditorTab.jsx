import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Icons from "../../../../assets/icons";
import AceEditor from "react-ace";

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-language_tools";

const getEditorLanguage = (lang) => {
  switch (lang) {
    case "Python":
    case "Java":
    case "SQL":
      return lang.toLowerCase();
    case "Cpp":
      return "c_cpp";
    case "C#":
      return "csharp";
    default:
      return "python";
  }
};

function CodeEditorTab({ codingProblem, RunCodeResult, onSubmit }) {
  React.useEffect(() => {
    setCode(codingProblem.last);
  }, [codingProblem.last]);

  const [code, setCode] = React.useState("");
  const [lineNumber, setLineNumber] = React.useState(1);
  const editorRef = React.useRef(null);

  return (
    <div className="assignment-codeground">
      <Tabs defaultActiveKey="home" transition={false}>
        <Tab eventKey="home" title="main.cpp">
          <div className="code-editor">
            <div className="code-editor__header d-flex align-items-center justify-content-between">
              <div className="code-editor__file">
                samples/practice/files/index.html{" "}
                <div className="divider mx-3"></div> Line {lineNumber}
              </div>
            </div>
            <div className="code-editor__body">
              <AceEditor
                mode={getEditorLanguage(codingProblem.Language)}
                placeholder="Please enter your code"
                theme="textmate"
                onChange={(e) => {
                  setCode(e);
                  const selectionRange =
                    editorRef.current.editor.getSelectionRange();
                  setLineNumber(selectionRange.start.row + 1);
                }}
                value={code}
                fontSize={18}
                width={"100%"}
                height={"100%"}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                }}
                ref={editorRef}
              />
            </div>
            <div className="code-editor__actions d-flex align-items-center justify-content-between">
              {RunCodeResult ? (
                <div className="left d-flex align-items-center">
                  <div className="code-progress me-4">
                    <div className="code-progress-title d-flex align-items-center justify-content-between">
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: 1.2,
                          color: "#404040",
                        }}
                      >
                        {" "}
                        Code{" "}
                      </span>
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: 12,
                          lineHeight: "14px",
                          color: "#404040",
                        }}
                      >
                        {RunCodeResult.GradeTable.CompilationGrade}/
                        {RunCodeResult.GradeTable.CompilationWeight}
                      </span>
                    </div>
                    <div
                      className="progress"
                      style={{ height: 16, width: 160 }}
                    >
                      <div
                        role="progressbar"
                        className="progress-bar bg-primary"
                        style={{
                          width: `${
                            (RunCodeResult.GradeTable.CompilationGrade /
                              RunCodeResult.GradeTable.CompilationWeight) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="code-progress d-flex flex-column">
                    <div className="code-progress-title d-flex align-items-center justify-content-between">
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: 1.2,
                          color: "#404040",
                        }}
                      >
                        Execution
                      </span>
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: 12,
                          lineHeight: "14px",
                          color: "#404040",
                        }}
                      >
                        {RunCodeResult.GradeTable.TestsGrade}/
                        {RunCodeResult.GradeTable.TestsWeight}
                      </span>
                    </div>
                    <div
                      className="progress"
                      style={{ height: 16, width: 160 }}
                    >
                      <div
                        role="progressbar"
                        className="progress-bar bg-primary"
                        style={{
                          width: `${
                            (RunCodeResult.GradeTable.TestsGrade /
                              RunCodeResult.GradeTable.TestsWeight) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="left d-flex align-items-center"></div>
              )}
              <div className="right">
                <button
                  className="button button-outline button-primary mx-4"
                  // disabled={codingProblem.submissions > codingProblem.Attempts}
                >
                  <Icons.Action.Refresh></Icons.Action.Refresh> Reset
                </button>
                <button
                  className="button button-primary px-4"
                  // disabled={codingProblem.submissions > codingProblem.Attempts}
                  onClick={() => onSubmit(code)}
                >
                  <Icons.PlayVideo></Icons.PlayVideo> RUN CODE
                </button>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default CodeEditorTab;
