/*
Interaction (Code Assignment)
*/

'use strict';

const TAB_SIZE = 4;

// Global variables
var g_Tab = "";
var g_Language, g_Input, g_LastSubmissionCode, g_Keywords, g_KeywordsOutput;
var g_CodingProblemKeywords;

var errors;
var oldText;
var SubmittedFIle;


// Select and show the 'instructions' tab
$('#tabInstructAndSumm li button#instructions-tab').tab('show');

// Initial setup
Setup();


///////////////////////////////////////////////////////////////////////////////////////////////////
function setBestGradeCircularProgress(iPercent) {
    iPercent = parseInt(iPercent);
    if (iPercent < 0) iPercent = 0;
    if (iPercent > 100) iPercent = 100;

    $("#circular-progress").css('stroke-dashoffset', 100 - iPercent);
    $("#circular-progress-value").text(iPercent.toString() + "%");

    // Hide the progress 'filling' when percent is 0 (avoid showing a blue dot!)
    $("#circular-progress").css('display', iPercent == 0 ? "none" : "block");

    // On 100%, the filling and the value label should be green
    $("#circular-progress").css('stroke', iPercent == 100 ? "var(--palette-green-full)" : "var(--palette-blue-normal)");
    $("#circular-progress-value").css('color', iPercent == 100 ? "var(--palette-green-full)" : "var(--palette-blue-normal)");
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setCodeSubmissionCount(iSubmissionCount, iMaxAttemptCount) {
    $("#submissions").text(iSubmissionCount);
    $("#max-attempts").text(iMaxAttemptCount);

    $("#progress-submissions").css('width', parseInt((iSubmissionCount / iMaxAttemptCount) * 100).toString() + "%");

    if (iSubmissionCount >= iMaxAttemptCount) {
        $(".assessment-submissions span").addClass("full");
        $("#progress-submissions").addClass("full");
    } else {
        $(".assessment-submissions span").removeClass("full");
        $("#progress-submissions").removeClass("full");
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setCodeSubmissionDateTime(SubmissionDateTime, bPostDue) {
    $(".assessment-submissions .submission-date").css('display', "flex"); // Show the section
    $("#submission-date").text(SubmissionDateTime);
    if (bPostDue) {
        $(".assessment-submissions .submission-date").removeClass("ontime").addClass("postdue");
    } else {
        $(".assessment-submissions .submission-date").removeClass("postdue").addClass("ontime");
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setSummaryGradeProgress(iValue, iMaxValue, idElmValue) {
    var elmValue = $("#" + idElmValue), elmProgress = elmValue.parent().siblings('.progress').children('.progress-bar');

    elmValue.text(iValue + " / " + iMaxValue);
    elmProgress.css('width', parseInt((iValue / iMaxValue) * 100).toString() + "%");

    if (iValue >= iMaxValue) {
        elmValue.addClass("full");
        elmProgress.addClass("full");
    } else {
        elmValue.removeClass("full");
        elmProgress.removeClass("full");
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function fixStringNewline(strInput) {
    var strOutput = strInput.replaceAll("\r\n", "<br/>");
    strOutput = strOutput.replaceAll("\n", "<br/>");
    return strOutput.replaceAll("\r", "<br/>");
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setSummaryOutput(strCodeOutput, bCodeSuccess, strExecutionOutput, bExecutionSuccess, strFeedback, duplicateMessage, isDuplicate) {
    var html, clsCode, clsExecution;
    debugger;
    isDuplicate = isDuplicate ? "failure" : "success";
    clsCode = bCodeSuccess ? "success" : "failure";
    clsExecution = bExecutionSuccess ? "success" : "failure";
    strCodeOutput = fixStringNewline(strCodeOutput);
    strExecutionOutput = fixStringNewline(strExecutionOutput);
    duplicateMessage = fixStringNewline(duplicateMessage);

    html = `
        <h4>Code</h4>
        <div class="output ${clsCode}">
            ${strCodeOutput}
        </div>

        <h4>Execution</h4>
        <div class="output ${clsExecution}">
            ${strExecutionOutput}
            ${duplicateMessage}
        </div>

        <br/> <!-- Needed when the button is hidden, don't depend on margins -->
        <button type="button" class="button solid px-3 float-right d-none" id="test-code-download" onclick="DowloadTestCode()">Download Tests</button>
    `;

    $("#summary-output").html(html);

    // Set feedback output
    if (strFeedback.length > 0) {
        debugger;
        html = `
            <h4>Feedback</h4>
            <div class="output ${clsExecution}">
                ${strFeedback}
            </div>
            <br/>
        `;

        $('#feedback .nocontent').css('display', "none");
        $('#feedback-exists').css('display', "block");
        $("#feedback-output").html(html);
    } else {
        $('#feedback-exists').css('display', "none");
        $('#feedback .nocontent').css('display', "block");

        $("#feedback .nocontent span").text("No feedback to show. See your results in the 'Summary' tab.");
    }

    //Set Waring
    //if (duplicateMessage.length > 0) {
    //    debugger;
    //    html = `
    //        <h4>warning</h4>
    //        <div class="output ${isDuplicate}">
    //            ${duplicateMessage}
    //        </div>
    //        <br/>
    //    `;

    //    $('#feedback .nocontent').css('display', "none");
    //    $('#feedback-exists').css('display', "block");
    //    $("#feedback-output").html(html);
    //} else {
    //    $('#feedback-exists').css('display', "none");
    //    $('#feedback .nocontent').css('display', "block");
    //}
}


///////////////////////////////////////////////////////////////////////////////////////////////////
async function CallCompiler(name, continuation) {
    const codingProblemId = GetFromQueryString("codingProblemId"), code = '';
    const CourseInstanceId = GetFromQueryString("courseInstanceId");
    const ModuleObjectiveId = GetFromQueryString("moduleId");
    const data = { codingProblemId, code, CourseInstanceId, ModuleObjectiveId };

    fetchCompiler(name, data).then(d => continuation(d));
}


///////////////////////////////////////////////////////////////////////////////////////////////////
async function CallFunction(name, continuation) {
    const codingProblemId = GetFromQueryString("codingProblemId");
    const CourseInstanceId = GetFromQueryString("courseInstanceId");
    const ModuleObjectiveId = GetFromQueryString("moduleId");
    const files = document.getElementById("fileUpload").files;
    let file = undefined, code = undefined;

    if (files.length > 0 && (g_Language == "Tableau" || g_Language == 'HTML')) {
        file = files[0];
        var fr = new FileReader();
        fr.readAsText(file);
        fr.onload = fcontent => {
            code = fcontent.target.result;
            const data = { codingProblemId, code, CourseInstanceId, ModuleObjectiveId };

            fetchCompiler(name, data).then(d => continuation(d));
        }
    } else if (files.length > 0 && (g_Language == "Excel" || g_Language == "Image")) {
        file = files[0];
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = fcontent => {
            code = GetFileBase64String(fcontent.target.result);
            const data = { codingProblemId, code, CourseInstanceId, ModuleObjectiveId };

            fetchCompiler(name, data).then(d => continuation(d));
        }
    } else if (!IsFileUploadProblem()) {
        let code = document.getElementById("txtCode1").textContent;
        if (code != '') {
            let editor = ace.edit('txtCode1');
            code = editor.getSession().getValue();
        }
        var points = compare();
        const codeStructurePoints = points.extra - points.deducted;
        const data = { codingProblemId, code, CourseInstanceId, codeStructurePoints };

        fetchCompiler(name, data).then(d => continuation(d));
    } else {
        const data = { codingProblemId, g_LastSubmissionCode, CourseInstanceId, ModuleObjectiveId };

        fetchCompiler(name, data).then(d => continuation(d));
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function IsFileUploadProblem() {
    return (g_Language == "Tableau" || g_Language == "Excel" || g_Language == 'Image' || g_Language == 'HTML');
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function SupportedFileExtension() {
    if (g_Language == "Tableau") return "tbw";
    else if (g_Language == "Excel") return "xlsx, xls";
    else if (g_Language == "Image") return "jpg, png";
    else if (g_Language == "HTML") return "html";
    else return "";
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function GetFileBase64String(base64Str) {
    var substr = "base64,";
    var index = base64Str.indexOf(substr);

    if (index == -1) return "";

    return base64Str.substring(index + substr.length);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function Setup() {
    for (let i = 0; i < TAB_SIZE; i++) g_Tab += "\u0020"; // 0x20 = 32 (space)

    CallCompiler("codingproblem", d => {
        //console.log(d); // Just for debugging
        //d.dueDate = "12:00:00 AM Friday 3 , 2022"; // Just for debugging

        g_Language = d.Language;

        $("#assignment-title").text(d.Title);
        setBestGradeCircularProgress(d.grade == null ? 0 : parseInt(d.grade));
        setCodeSubmissionCount(d.submissions, d.Attempts);
        $("#txtInstructions").html(d.Instructions);

        // Save "editable" fields' data. Refer to \PageScripts\UserInterface.js
        sessionStorage.setItem("txtInstructions", d.Instructions);
        sessionStorage.setItem("assignment-due-date", d.dueDate);
        sessionStorage.setItem("assignment-title", d.Title);
        sessionStorage.setItem("txtCode1", d.Script);
        sessionStorage.setItem("max-attempts", d.Attempts);
        
        if (d.dueDate == null) {
            $("#due-container").css('display', "none");
            $("#due-grade-vertsep").css('opacity', 0); // Using 'opacity' because 'display' is used for show/hide in bootstrap's responsive breakpoints.
        } else {
            $("#due-container").css('display', "flex");
            $("#due-grade-vertsep").css('opacity', 1);
            $("#assignment-due-date").text(d.dueDate);
        }

        // Hide "Submit" & "Reset" buttons on 100% submissions
        if (d.submissions >= d.Attempts) {
            $("#code-submit").css('display', "none");
            $("#btnReset").css('display', "none");
        }

        g_Keywords = d.Keywords;
        g_CodingProblemKeywords = d.Keywords;
        g_KeywordsOutput = d.KeywordsOutput;
        g_Input = d.Solution.toString();
        g_LastSubmissionCode = d.last;

        // Comments
        $("#comment-area").css('display', "none");
        if (d.comment != "") {
            $("#comment-area").css('display', "");
            $("#comment-title").text("Comment:");
            $("#comment-detail").text(d.comment);
        }
        
        if (IsFileUploadProblem()) {
            $("#interaction-file-area").css('display', "");
            $("#fileUpload").css('display', "");
            $("#file-submit").css('display', "");
            $("#code-submit").css('display', "none");
            $("#coding-section").css('display', "none");
            $("#txtCode1").css('display', "none");
            $("#btnReset").css('display', "none");
            $("#FileExtension").text(SupportedFileExtension());
        } else {
            $("#interaction-file-area").css('display', "none");
            $("#coding-section").css('display', "");
            $("#fileUpload").css('display', "none");
            $("#file-submit").css('display', "none");
            $("#code-submit").css('display', "");
            $("#btnReset").css('display', "");

            var elem = document.getElementById('txtCode1');
            elem.spellcheck = false;
            elem.focus();
            elem.blur();

            let languageMode = getLanguage(d.Language.toString().toLowerCase()); // assign language mode to a string or false.

            if (d.last === undefined) {
                document.getElementById("txtCode1").textContent = ((d.Before) ? d.Before + "\n\n" : "") + d.Script;

                //may need to set up else
                if (languageMode != false) {
                    // this means language was found
                    ace.require("ace/ext/language_tools");
                    var editor = ace.edit('txtCode1');
                    editor.setTheme("ace/theme/textmate"); // (orig: dreamweaver) refer to https://github.com/ajaxorg/ace/tree/master/lib/ace/theme
                    editor.session.setMode(languageMode);
                    editor.setOptions({
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true
                    });
                }
            } else {
                document.getElementById("txtCode1").textContent = d.last;
                //may need to set up else
                if (languageMode != false) {
                    // this means language was found
                    ace.require("lib/ext/language_tools");
                    var editor = ace.edit('txtCode1');
                    editor.setTheme("ace/theme/textmate"); // (orig: dreamweaver) refer to https://github.com/ajaxorg/ace/tree/master/lib/ace/theme
                    editor.session.setMode(languageMode);
                    editor.setOptions({
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true
                    });
                }
            }

            if (d.TestCodeForStudent && d.TestCodeForStudent !== '') {
                $("#test-code-download").removeClass("d-none");
                document.getElementById("test-code").value = d.TestCodeForStudent;
                document.getElementById("test-code-filename").value = d.TestCodeFilename;
            }
        }


        // Hide loading spinner
        $("#loader-spinner").css('display', "none");

        if (d.submissions > 0 && (!IsFileUploadProblem() || g_LastSubmissionCode != null)) {
            //----------------------------Download file-------------------------
            SubmittedFIle = d.last;
            if (g_Language == "Excel") {
                document.getElementById("download-excel-file").style.display = "";
            }
            if (g_Language == "Image") {
                document.getElementById("download-image-file").style.display = "";
            }
            //---------------------------------------------------------------
        }
    });

    return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function testActualErrorsLine(strLine) {
    strLine = strLine.toLowerCase();

    if (strLine.indexOf("passed") >= 0) return true;
    if (strLine.indexOf("failed") >= 0) return false;

    var parOpenIndex = strLine.indexOf('('), parCloseIndex = strLine.indexOf(')');
    strLine = strLine.substr(parOpenIndex + 1, (parCloseIndex - parOpenIndex) - 1);

    var sepIndex = strLine.indexOf('/');
    var num1 = parseInt(strLine.substr(0, sepIndex).trim()), num2 = parseInt(strLine.substr(sepIndex + 1).trim());

    if (num1 < num2) return false;
    return true;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function removeExpectedGrade(strLine) {
    return strLine.substr(strLine.indexOf('-') + 2);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function RunCode() {
    let codingProblemId = GetFromQueryString("codingProblemId");
    if (codingProblemId == 292) {
        location.href = 'experiment/material.html';
    }

    $("#loader-spinner").css('display', "block"); // Show the loading spinner

    CallFunction("Assignment/RunCode", d => {
        //console.log(d); // Just for debugging

        g_KeywordsOutput = d.KeywordsOutput;
        g_LastSubmissionCode = d.last;

        // Hide "Submit" & "Reset" buttons on 100% submissions
        if (d.Submissions >= d.Attempts) {
            $("#code-submit").css('display', "none");
            $("#btnReset").css('display', "none");
        }

        // Update code submission progress, and show the submission date indicating pastdue or ontime
        setCodeSubmissionCount(d.Submissions, d.Attempts);
        setCodeSubmissionDateTime(d.Now, d.PastDue);

        // Open the 'summary' tab and show the results
        $('#summary .nocontent').css('display', "none");
        $('#summary-exists').css('display', "block");
        $('#tabInstructAndSumm li button#summary-tab').tab('show');

        setSummaryGradeProgress(d.GradeTable.CompilationGrade, d.GradeTable.CompilationWeight, "summary-code");
        setSummaryGradeProgress(d.GradeTable.TestsGrade, d.GradeTable.TestsWeight, "summary-execution");

        if (GetFromQueryString("codingProblemId") != '330') {
            setBestGradeCircularProgress(d.BestGrade == null ? 0 : d.BestGrade);
        } else {
            document.getElementById('summarydiv').style.display = 'none';
        }

        var outputCompilation = "", bCompiledSuccessfully = false, outputExecution = "", bExecutedSuccessfully = false, outputFeedback = "", isDuplicate = false, duplicateMessage = "";
        if ((g_Language == "C#") || (g_Language == "Java") || (g_Language == "Cpp") || (g_Language == "AzureDO") ||
                (g_Language == "REST") || (g_Language == "Browser") || (g_Language == "R") || (g_Language == "WebVisitor") ||
                (g_Language == "CosmoDB") || (g_Language == "Python")) {
            if (!d.ExeResult.Compiled) {
                if (d.ExeResult.Message != null) {
                    for (var i = 0; i < d.ExeResult.Message.length; i++) {
                        outputCompilation += d.ExeResult.Message[i] + '<br/>';
                    }
                }
                if (d.codeHints != null) {
                    for (var i = 0; i < d.CodeHints.length; i++) {
                        outputCompilation += d.CodeHints[i].Error + '<br/>';
                    }
                }
            } else {
                outputCompilation = "Compilation Successful";
            }
        } else if (g_Language == "SQL" || g_Language == "DB") {
            outputCompilation = d.Tests[0].ActualErrors.join("<br/>");
        } else {
            outputCompilation = (d.ExMessage ? d.ExMessage + "<br/>" : "") +
                ((d.ExeResult && d.ExeResult.ExMessage) ? d.ExeResult.ExMessage + "<br/>" : "") +
                ((d.ExeResult && d.ExeResult.ErrorList) ? d.ExeResult.ErrorList + "<br/>" : "") +
                ((d.ExeResult && (d.ExeResult.Succeeded == false) && d.ExeResult.Output) ? d.ExeResult.Output : "");
        }


        if (d.ExeResult.Compiled != undefined) bCompiledSuccessfully = d.ExeResult.Compiled;

        if (bCompiledSuccessfully == false) {
            // When code isn't compiled successfully, there will be no executable to be executed!
            bExecutedSuccessfully = false;
            outputExecution = "";
        } else {
            
            // When code is successfully compiled, execution may either succeed or fail.
            if (d.TestCount != undefined && d.TestCount > 0 && typeof(d.Tests) == 'object' && d.Tests.length > 0) {
                var strExpected = "", strActual = "";
                
                if (d.ExeResult != undefined && d.ExeResult.Output != undefined && d.ExeResult.Output.length > 0) {
                    strActual = '<br/>' + d.ExeResult.Output;
                }

                bExecutedSuccessfully = true;
                for (var i = 0; i < d.Tests.length; i++) {
                    if (d.Tests[i].Passed != true)
                        bExecutedSuccessfully = false;
                    
                    if (typeof (d.Tests[i].ActualErrors) == 'object' && d.Tests[i].ActualErrors.length > 1) {
                        debugger;
                        strExpected += '<br/>' + d.Tests[i].Expected;
                        outputFeedback += d.Tests[i].ActualErrors.join('<br/>') + '<br/>';
                    }
                    else
                    {
                        debugger;
                        strExpected += '<br/>' + removeExpectedGrade(d.Tests[i].Expected);
                        if (d.Tests[i].Actual != null) {
                            outputFeedback += d.Tests[i].Actual + '<br/>';
                        }
                        else {
                            outputFeedback += d.Tests[i].ActualErrors.join('<br/>') + '<br/>';
                            strActual = outputFeedback;
                        }
                        
                    }
                }
                if (bExecutedSuccessfully != true) {
                    outputExecution = `Expected:${strExpected}<br/><br/>Actual:${strActual}`;
                } else {
                    outputExecution = "Execution Successful";
                }
            } else if (d.ExeResult) {
                if (d.ExeResult.Succeeded) {
                    bExecutedSuccessfully = true;
                    // Check that all tests have full marks (d.ExeResult.Succeeded doesn't always indicate 100% execution success)
                    if (typeof (d.ExeResult.ActualErrors) == 'object' && d.ExeResult.ActualErrors.length > 0) {
                        for (var i = 0; i < d.ExeResult.ActualErrors.length; i++) {
                            if (testActualErrorsLine(d.ExeResult.ActualErrors[i]) != true) bExecutedSuccessfully = false;
                            outputExecution += d.ExeResult.ActualErrors[i];
                        }
                    }

                    if (bExecutedSuccessfully == false && d.ExeResult.Output != undefined && d.ExeResult.Output.length > 0) {
                        outputExecution = "Actual Errors:<br/>" + d.ExeResult.Output + "<br/>" + outputExecution;
                    }

                    // Both compilation and execution succeeded. Just show this message. No need to show the output. (2022-07-28)
                    if (bExecutedSuccessfully == true) outputExecution = "Execution Successful";
                } else {
                    bExecutedSuccessfully = false;
                    // Compiled successfully, but execution error occurred
                    if (d.ExeResult.ActualErrors != undefined && d.ExeResult.ActualErrors.length > 0) {
                        outputExecution = d.ExeResult.ActualErrors.join("<br/>");
                    } else if (d.ExeResult.Output != undefined) {
                        outputExecution = d.ExeResult.Output;
                    } else if (d.ExeResult.Message != undefined && d.ExeResult.Message.length > 0) {
                        outputExecution = d.ExeResult.Message.join("<br/>");
                    } else {
                        outputExecution = "Execution Failed"; // No output message defined!
                    }
                }
            } else {
                bExecutedSuccessfully = d.GradeTable.TestsGrade == d.GradeTable.TestsWeight ? true : false;
                outputExecution = "Execution Failed"; // No output message defined!
            }
        }
        
        // When execution is successful just show this message. No need to show the output. (2022-07-28)
        if (bExecutedSuccessfully) outputExecution = "Execution Successful";
        //Row or Column found duplicate
        debugger;
        if (d.ExeResult.IsDuplicate == true) {
            
            duplicateMessage = "<br/>Warning:" + d.ExeResult.DuplicateMessage;
            isDuplicate = true;
        }
        setSummaryOutput(outputCompilation, bCompiledSuccessfully, outputExecution, bExecutedSuccessfully, outputFeedback, duplicateMessage, isDuplicate);
        //setSummaryOutput(outputCompilation, false, outputExecution, false, outputFeedback);

        document.getElementById("comment-area").style.display = 'none';

        // Hide the loading spinner
        $("#loader-spinner").css('display', "none");
    });

    return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function download(filename, text) {
    var element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function DowloadTestCode() {
    const filename = document.getElementById("test-code-filename").value;
    let editor = ace.edit('txtCode1');
    const content = editor.getSession().getValue() + '\r\n\r\n' + document.getElementById("test-code").value;

    download(filename, content);
    return false;
}


function DisplaySQLQueryTable(id, text) {
    var tblSQL = document.getElementById(id);
    tblSQL.innerHTML = "";
    const lines = text.split('\n');
    if (lines.length > 0) {
        document.getElementById(id).innerHTML = "<thead id='" + id + "_head'><tr></tr></thead>" + 
            "<tbody></tbody>";
        const columns = lines[0].split("||");
        const percent = 100 / columns.length;
        for (var j = 0; j < columns.length; j++) {
            document.getElementById(id + "_head").firstElementChild.insertAdjacentHTML('beforeend', "<th style=\"width:" + percent.toString() + "%; text - align:center \">" + columns[j] + "</th>");
        }

        ClearTable(tblSQL);
        var tBody = tblSQL.tBodies[0];

        for (var j = 1; j < lines.length; j++) {
            let elements = lines[j].split("||");
            var tr = NewTr();
            for (var k = 0; k < elements.length; k++) {

                tr.appendChild(NewTd(elements[k].toString()));
            }
            tBody.appendChild(tr);
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function Reset() {
    // Show loading spinner
    $("#loader-spinner").css('display', "");

    CallCompiler("codingproblem", d => {
        g_Language = d.Language;
        $("#txtInstructions").html(d.Instructions);
        setCodeSubmissionCount(d.submissions, d.Attempts);
        setBestGradeCircularProgress(d.grade == null ? 0 : parseInt(d.grade));

        // Hide "Submit" & "Reset" buttons on 100% submissions
        if (d.Submissions >= d.Attempts) {
            document.getElementById('code-submit').style.display = 'none';
            document.getElementById('btnReset').style.display = 'none';
        }

        g_Keywords = d.Keywords;
        g_CodingProblemKeywords = d.Keywords;
        g_KeywordsOutput = d.KeywordsOutput;
        g_Input = d.Solution.toString();
        g_LastSubmissionCode = d.last;

        // Reset the Summary area
        $('#summary-exists').css('display', "none");
        $('#summary .nocontent').css('display', "block");
        $('#feedback-exists').css('display', "none");
        $('#feedback .nocontent').css('display', "block");
        $('#tabInstructAndSumm li button#instructions-tab').tab('show');

        // Comments
        $("#comment-area").css('display', "none");
        if (d.comment != "") {
            $("#comment-area").css('display', "");
            $("#comment-title").text("Comment:");
            $("#comment-detail").text(d.comment);
        }


        if (IsFileUploadProblem()) {
            $("#interaction-file-area").css('display', "");
            $("#fileUpload").css('display', "");
            $("#file-submit").css('display', "");
            $("#code-submit").css('display', "none");
            $("#coding-section").css('display', "none");
            $("#txtCode1").css('display', "none");
            $("#btnReset").css('display', "none");
            $("#FileExtension").text(SupportedFileExtension());
        } else {
            $("#interaction-file-area").css('display', "none");
            $("#coding-section").css('display', "");
            $("#fileUpload").css('display', "none");
            $("#file-submit").css('display', "none");
            $("#code-submit").css('display', "");
            $("#btnReset").css('display', "");

            var elem = document.getElementById('txtCode1');
            elem.spellcheck = false;
            elem.focus();
            elem.blur();

            let languageMode = getLanguage(d.Language.toString().toLowerCase()); // assign language mode to a string or false.

            if (languageMode != false) {
                // this means language was found
                ace.require("ace/ext/language_tools");
                var editor = ace.edit('txtCode1');
                editor.setTheme("ace/theme/textmate"); // (orig: dreamweaver) refer to https://github.com/ajaxorg/ace/tree/master/lib/ace/theme
                editor.session.setMode(languageMode);
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
                var resetScript = ((d.Before) ? d.Before + "\n\n" : "") + d.Script;
                editor.session.setValue(resetScript);
            }
        }

        // Hide loading spinner
        $("#loader-spinner").css('display', "none");

        if (d.submissions > 0 && (!IsFileUploadProblem() || g_LastSubmissionCode != null)) {
            //----------------------------Download file-------------------------
            SubmittedFIle = d.last;
            if (g_Language == "Excel") {
                document.getElementById("download-excel-file").style.display = "";
            }
            if (g_Language == "Image") {
                document.getElementById("download-image-file").style.display = "";
            }
            //---------------------------------------------------------------
        }
    });

    return false;
}

function NewTd(text, className) {
    var td = document.createElement("td");
    var t = document.createTextNode(text);
    if (className) {
        td.className = className;
    }
    td.appendChild(t);
    return td;
}
function NewTdForDate(text, text2,) {
    var td = document.createElement("td");
    var t = document.createTextNode(text);
    var br = document.createElement("br");
    var t2 = document.createTextNode(text2);

    td.appendChild(t);
    td.appendChild(br);
    td.appendChild(t2);
    return td;
}
function NewTdI(className) {
    var td = document.createElement("td");
    var i = document.createElement("i");
    i.className = className;
    td.appendChild(i);
    return td;
}

function NewTdA(href, onclick, value) {
    var td = document.createElement("td");
    var aElem = document.createElement("a");
    aElem.href = href;
    aElem.setAttribute("onclick", onclick);
    var linkText = document.createTextNode(value);
    aElem.appendChild(linkText);
    td.appendChild(aElem);
    return td;
}

function NewTr(id) {
    var newRow = document.createElement("tr");
    if (id) {
        newRow.setAttribute("id", id);
    }
    return newRow;
}

function ClearTable(tbl) {
    if (tbl != null) {
        tbl.tBodies[0].innerHTML = "";
    }
}

function SplitErrorList(errorList) {
    if (g_Language == "C#")
        return SplitErrorCSharp(errorList);
    else if (g_Language == "Java")
        return SplitErrorJava(errorList);
}

function SplitErrorCSharp(errorList) {
    //(10,12): error CS1001: Message...
    errors = [];

    var lineNumber = 0;
    var type = "";
    var code = "";
    var message = "";

    for (var i = 0; i < errorList.length; i++) {
        var error = errorList[i];
        // extracting (1,1)
        var posColon = error.indexOf(":");
        if (posColon < 5) {
            errors.push({ line: '', type: 'error', code: '', message: error });
            continue;
        }

        if ((error.charAt(0) != '(') || (error.charAt(posColon - 1) != ')')) continue;

        var posComma = error.indexOf(",");
        if ((posComma < 2) || (posComma > posColon - 3)) continue;

        lineNumber = error.slice(1, posComma);

        // extracting type
        if (error.length < posColon + 2 + 1) {
            errors.push({ line: lineNumber, type: type, code: code, message: message });
            continue;
        }
        error = error.slice(posColon + 2);
        var posSpace = error.indexOf(" ");
        if (posSpace == -1) {
            errors.push({ line: lineNumber, type: type, code: code, message: message });
            continue;
        }
        type = error.slice(0, posSpace);

        //extract code
        if (error.length < posSpace + 1) {
            errors.push({ line: lineNumber, type: type, code: code, message: message });
            continue;
        }
        error = error.slice(posSpace + 1);
        posColon = error.indexOf(":");
        if (posColon == -1) {
            errors.push({ line: lineNumber, type: type, code: code, message: message });
            continue;
        }
        code = error.slice(0, posColon);

        //extract message
        if (error.length < posColon + 2) {
            errors.push({ line: lineNumber, type: type, code: code, message: message });
            continue;
        }
        message = error.slice(posColon + 2);

        errors.push({ line: lineNumber, type: type, code: code, message: message });
    }
    return errors;
}

function SplitErrorJava(errorList) {
    errors = [];
    //"java:14: error:message..."
    var lineNumber;
    var type;
    var code;
    var message;

    var errorPosition = errorList.indexOf("java:");
    if (errorPosition == -1) return errorList;
    while (errorPosition != -1) {

        lineNumber = 0;
        type = "";
        code = "";
        message = "";

        // extracting line
        if (errorList.length < errorPosition + 6) {
            break;
        }
        errorList = errorList.slice(errorPosition + 5);

        var posColon = errorList.indexOf(":");
        if (posColon == -1) {
            break;
        }

        lineNumber = errorList.slice(0, posColon);

        // extracting type
        if (errorList.length < posColon + 3) {
            errors.push({ line: lineNumber, type: type, code: code, message: message });
            break;
        }
        errorList = errorList.slice(posColon + 2);

        posColon = errorList.indexOf(":");
        if (posColon == -1) {
            message = errorList;
            errors.push({ line: lineNumber, type: type, code: code, message: message });
            break;
        }

        type = errorList.slice(0, posColon);
        errorList = errorList.slice(posColon + 1);

        errorPosition = errorList.indexOf("java:");
        if (errorPosition == -1) {
            message = errorList;
        } else {
            message = errorList.slice(0, errorPosition);
        }

        errors.push({ line: lineNumber, type: type, code: code, message: message });
    }
    return "";
}
/**
 * Gets Breaks down the solution and submission to keywords then compares the keywords. Populates items on the front end for user to review.
 * 
 * Utilizes two helper functions: getTheKeywords() & splitIntoWords()
 * 
 * @todo Remove all solution related content from the front end
 * 
 * @param {string} keywords
 * @param {any} solution
 */
function GetHints(keywords, solution) {
    var theWords = keywords.split(',');
    let theHints = '';

    if (solution && Object.keys(solution).length !== 0 && Object.getPrototypeOf(solution) === Object.prototype) {
        for (var i = 0; i < theWords.length; i++) {
            if (solution[theWords[i]] != undefined) {
                if (solution[theWords[i]] < 0) {
                    theHints += `<li class="list-group-item">The solution has ${-solution[theWords[i]]} less <span class="font-weight-bold" style="color:#23A3DD;">${theWords[i]}</span>(s) than your code.</li>`;
                } else if (solution[theWords[i]] > 0) {
                    theHints += `<li class="list-group-item">The solution has ${solution[theWords[i]]} more <span class="font-weight-bold" style="color:#23A3DD;">${theWords[i]}</span>(s) than your code.</li>`;
                }
            }
        } // end of for

        if (theHints != '') {
            document.getElementById("theHints").innerHTML = theHints;
            //document.getElementById("hintHeading").textContent = 'Hints';
            //------------------Create a link------------------------------
            var hintsa = newHindsLink();
            document.getElementById("hintContainer").innerHTML = "";
            document.getElementById("hintContainer").appendChild(hintsa)
        }
    } // end of if (JSON.stringify(solutionKeywordCount) !== JSON.stringify(submissionKeywordCount))

    document.getElementById("theHints").innerHTML = theHints;
}

function ErrorInLine(lineNumber) {
    if (errors == null) return false;
    for (var i = 0; i < errors.length; i++) {
        if (errors[i].line == lineNumber && errors[i].type == 'error') {
            return true;
        }
    }
    return false;
}

function UnderlineErrorLines(elem) {
    if (errors == null || errors.length == 0) return;

    var text = elem.innerHTML;
    var newHTML = "";
    var lineNumber = 1;
    var isErrorLine = ErrorInLine(lineNumber);
    var startedUnderlining = false;
    text = text.replace(/&nbsp;/g, ' ');
    for (var i = 0; i < text.length; i++) {
        var symbol = text[i];
        if (isErrorLine && !startedUnderlining && text[i] != ' ' && text[i] != '\u00a0' && text[i] !== '\t' && text[i] !== '&nbsp;') {
            newHTML += "<span class='error-underline-dotted'>";
            startedUnderlining = true;
        }
        newHTML += text[i];

        if (text[i] === '\n') {
            if (startedUnderlining)
                newHTML += "</span>";
            startedUnderlining = false;
            lineNumber++;
            isErrorLine = ErrorInLine(lineNumber);
        }
    }
    elem.innerHTML = newHTML;
}

function DisplayCompilationTable(compiled, errors) {
    var tblErrors = document.getElementById("tblCompilation");
    ClearTable(tblErrors);

    if (compiled)
        return;

    var tBody = tblErrors.tBodies[0];

    var tr = NewTr();
    tr.appendChild(NewTd("  "));
    tr.appendChild(NewTd("Code"));
    tr.appendChild(NewTd("Description"));
    tr.appendChild(NewTd("Line"));
    tBody.appendChild(tr);

    if (typeof errors != 'undefined') {
        for (var i = 0; i < errors.length; i++) {
            tr = NewTr();
            var icon = (errors[i].type == "error") ? "fa fa-times text-danger" : "fa fa-check text-success";
            tr.appendChild(NewTdI(icon));
            tr.appendChild(NewTd(errors[i].code));
            tr.appendChild(NewTd(errors[i].message));
            tr.appendChild(NewTd(errors[i].line));
            tBody.appendChild(tr);
        }
    }
}

/*=======================Aidan's code=======================*/
function AddIdentation(event) {
    if (event == null) return;

    if (event.keyCode === 13) { // new line
        event.preventDefault();
        var identation = getIndentation();
        if (identation == "") return false;
        var editor = document.getElementById("txtCode1");
        var doc = editor.ownerDocument.defaultView;
        var sel = doc.getSelection();
        var range = sel.getRangeAt(0);

        var tabNode = document.createTextNode(identation); //tab
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

function getIndentation() {
    var elem = document.getElementById('txtCode1');
    var text = elem.textContent;
    var newLine = true;
    var indentation = "";

    //var end = getCaretPosition(elem)[0];
    var end = getCaretPosition(elem);

    text = text.replace(/&nbsp;/g, ' ');
    for (var i = 0; i < end; i++) {
        if (text[i] === '\n' && i != (end - 1)) {

            indentation = "";
            newLine = true;
        } else if ((text[i] === '\u0009' || text[i] === '\u0020' || text[i] === '\u00a0') && newLine) {
            indentation += text[i];
        } else {
            newLine = false;
        }
    }
    return indentation;
}

function compare(event) {
    AddIdentation(event);

    if (IsFileUploadProblem() || g_Language == 'SQL' || g_Language == 'Cpp' ||
            g_Keywords == null || g_Input == "" || g_Input == "-") {
        return { deducted: 0, extra: 0 };
    }


    var input2 = document.getElementById("txtCode1").textContent;
    var terms = g_Keywords.split(",");
    //var termsOutput = g_KeywordsOutput.split(",");

    var hshOne = new Object();
    var hshTwo = new Object();
    var hshC = new Object();
    var hshCC = new Object();
    var few = 0;
    var many = 0;

    var pointsDeducted = 0;
    var pointsExtra = 0;
    var check = 0;
    var c1, c2, temp;

    for (var k in terms) {
        c1 = 0;
        c2 = 0;
        for (var j = 0; j < g_Input.length - terms[k].length; j++) {
            if (g_Input.substring(j, j + terms[k].length) == terms[k]) {
                if (j != 0 && j != g_Input.length - terms[k].length - 1) {
                    if ((!isLetter(g_Input[j - 1])) && (!isLetter(g_Input[j + terms[k].length]))) {
                        c1++;
                    }
                }
            }
        }
        for (var j = 0; j < input2.length - terms[k].length; ++j) {
            if (input2.substring(j, j + terms[k].length) == terms[k]) {
                if (j != 0 && j != input2.length - terms[k].length - 1) {
                    if ((!isLetter(input2[j - 1])) && (!isLetter(input2[j + terms[k].length]))) {
                        c2++;
                    }
                }
            }
        }

        hshC[terms[k]] = c1;
        hshCC[terms[k]] = c2;

        if (c1 != c2) {
            check++;
            if (c2 < c1) {
                hshOne[terms[k]] = c1 - c2;
                few++;
            }
            else {
                hshTwo[terms[k]] = c2 - c1;
                many++;
            }
        }
    }

    return {
        deducted: pointsDeducted,
        extra: pointsExtra
    };
}

function count(main_str, sub_str) {
    main_str += '';
    sub_str += '';

    if (sub_str.length <= 0) {
        return main_str.length + 1;
    }

    subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
}

function isLetter(strng) {
    strng.toLowerCase();
    return strng.length === 1 && strng.match(/[a-z]/i);
}

//------------  syntax highlighting  --------------------

function browserSupport() {
    // Get the user-agent string 
    var userAgentString =
        navigator.userAgent;

    // Detect Chrome 
    var chromeAgent =
        userAgentString.indexOf("Chrome") > -1;

    // Detect Internet Explorer 
    var IExplorerAgent =
        userAgentString.indexOf("MSIE") > -1 ||
        userAgentString.indexOf("rv:") > -1;

    // Detect Firefox 
    var firefoxAgent =
        userAgentString.indexOf("Firefox") > -1;


    // Detect Safari 
    var safariAgent =
        userAgentString.indexOf("Safari") > -1;

    // Discard Safari since it also matches Chrome 
    if ((chromeAgent) && (safariAgent))
        safariAgent = false;

    // Detect Opera 
    var operaAgent =
        userAgentString.indexOf("OP") > -1;

    // Discard Chrome since it also matches Opera      
    if ((chromeAgent) && (operaAgent))
        chromeAgent = false;

    return (chromeAgent || safariAgent || firefoxAgent);
}

function getStyle(word) {

    var keywordsArray = g_Keywords.split(",");
    var style = "";
    if ((word.length > 1) && IsOpeningComment(word[1], word[0])) {
        style = "color: rgb(0, 128, 0);";
    }
    else if ((word.length > 1) && (word[0] === '"')) {
        style = "color: rgb(163, 21, 21); ";
    } else if (keywordsArray.includes(word)) {
        style = "color: rgb(0, 0, 255); font-weight: bold;";
    }
    return style;
}

function onKeyDown(e) {
    if (e.keyCode === 9) { // tab key

        e.preventDefault();
        var editor = document.getElementById("txtCode1");
        var doc = editor.ownerDocument.defaultView;
        var sel = doc.getSelection();
        var range = sel.getRangeAt(0);

        var tabNode = document.createTextNode(g_Tab);
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (e.keyCode === 13) {

    }

}

//----------------------------------------------------------
function DeleteErrorFromList(lineNumber) {
    if (errors == null) return;
    for (var i = 0; i < errors.length; i++) {
        if (errors[i].line == lineNumber) {
            errors.splice(i, 1);
            return;
        }
    }
}

function AdjustErrorList(elem, position) {
    var newText = elem.textContent;

    var changedLines = FindDifferentLines(newText);
    for (var i = 0; i < changedLines.length; i++) {
        DeleteErrorFromList(changedLines[i]);
    }
}

function FindDifferentLines(newText) {
    var newLines = newText.split('\n');
    var oldLines = oldText.split('\n');

    var differentLines = [];

    var i = 0;
    while (i < newLines.length || i < oldLines.length) {
        if (i >= newLines.length || i >= oldLines.length) { // 
            while (i < Math.max(newLines.length, oldLines.length)) {
                differentLines.push(i + 1);
                i++;
            }
        } else if (newLines[i].length != oldLines[i].length) {
            differentLines.push(i + 1);
        } else {
            var newLine = newLines[i];
            var oldLine = oldLines[i];
            for (var j = 0; j < newLine.length; j++) {
                if (newLine[j] != oldLine[j]) {
                    differentLines.push(i + 1);
                    break;
                }
            }
        }

        i++;
    }
    return differentLines;
}
//-------------------------------------------------------------------------------

function HighlightSyntax() {
    var elem = document.getElementById('txtCode1');

    var positionArr = getCaretPosition(elem);
    if (positionArr == undefined) {
        return;
    }
    var position = positionArr[0];

    AdjustErrorList(elem, position);

    BuildNewHTML(elem);

    SetCaretPosition(elem, position);
}

/**
 * Receives language from setup() and will set up the IDE for the right language. 
 * 
 * To add more langauge supports, find the following file PageScripts/lib/ext.modelist.js
 * find var supportedModes, the key is what you need to add.
 * 
 * example: 
 * We need to add php (it's making a comeback?) to the file above, find the key for PHP
 * we find that the key is PHP. We'll add a case 'php' (must be lowercase) and problemLanguage
 * will be = 'ace/mode/php'
 * 
 * @param {string} theLanguage 
 * @returns string if language is found, false if not
 * 
 * @todo
 * - confirm the rest of the languages. Once that's confirmed get languages set up or removed.
 */
function getLanguage(theLanguage) {

    let problemLanguage = '';
    switch (theLanguage) {
        case 'azuredo':
            //problemLanguage = 'ace/mode/csharp';
            problemLanguage = false;
            break;
        case 'browser':
            //problemLanguage = 'ace/mode/csharp';
            problemLanguage = false;
            break;
        case 'c#':
            problemLanguage = 'ace/mode/csharp';
            break;
        case 'cpp':
            problemLanguage = 'ace/mode/c_cpp';
            break;
        case 'db':
            //problemLanguage = 'ace/mode/csharp';
            problemLanguage = false
            break;
        case 'java':
            problemLanguage = 'ace/mode/java';
            break;
        case 'javascript':
            problemLanguage = 'ace/mode/javascript';
            break;
        case 'python':
            problemLanguage = 'ace/mode/python';
            break;
        case 'r':
            problemLanguage = 'ace/mode/r';
            break;
        case 'rest':
            //problemLanguage = 'ace/mode/python';
            problemLanguage = false;
            break;
        case 'sql':
            problemLanguage = 'ace/mode/sql';
            break;
        case 'webvisitor':
            problemLanguage = 'ace/mode/python';
            //problemLanguage = false;
            break;
        default:
            problemLanguage = false;
            break;
    }
    return problemLanguage;
}

function BuildNewHTML(elem) {
    var words = splitIntoWords(elem);
    var newHTML = "";

    words.forEach(word => {
        if (style = getStyle(word)) {
            word = word.replace('<', '&lt;').replace('>', '&gt;');
            newHTML += "<span style='" + style + "'>" + word + "</span>";
        }
        else {
            word = word.replace('<', '&lt;').replace('>', '&gt;');
            newHTML += word;
        }

    });

    elem.innerHTML = newHTML;
    oldText = elem.textContent;
    NumerateLines();
}
/**
 * Takes string that represents code and breaks it down the characters into an array. 
 * Then it removes all indices that directly match the symbols in the var EndWordSymbols
 * 
 * At one time this function was rendered obsolete, then later repurposed.
 * @param {String} el
 * @returns {Object} result
 */
function splitIntoWords(el) {

    var result = [];
    var endWordSymbols = ['\u00a0', '\u0020', '\u0009', '\n', '\t', ' ', '(', '{', '[', ')', '}', ']', '=', '+', '-', '/', '*', '<', '>', '!', ',', ';', ':', '?', '\r'];
    var currentWord = "";
    var isString = false;
    var isComment = false;
    var isBlockComment = false;

    if (typeof el != 'string') {
        if (typeof el != 'undefined') {
            var text = el.textContent;
        }
    } else {
        var text = el;
    }

    function pushWordAndSymbol(symbol) {
        if (currentWord !== "") {
            result.push(currentWord);
            currentWord = "";
        }
        result.push(symbol);
    }
    function pushWordWithSymbol(symbol) {
        result.push(currentWord + symbol);
        currentWord = "";
    }
    function pushWordAddSymbol(symbol) {
        if (currentWord !== "") {
            result.push(currentWord);
        }
        currentWord = symbol;
    }
    /**
     * Removes any item from the result array that is received. 
     * Used to clean up items we wouldn't look for to provide hints
     * 
     * @param {String} item
     */
    function removeItemFromResult(item) {
        let myindex;
        while ((myindex = result.indexOf(item)) > -1) {
            result.splice(myindex, 1);
        }
    }

    for (var i = 0; i < text.length; i++) {

        var symbol = text[i];

        if ((symbol === '\n') && !isBlockComment) {
            isString = false;
            isComment = false;
            pushWordAndSymbol(symbol);
        } else if (symbol === '"' && isString && !isComment) {
            isString = false;
            pushWordWithSymbol(symbol);
        } else if (symbol === '"' && !isString && !isComment) {
            isString = true;
            pushWordAddSymbol(symbol);
        } else if (IsOpeningComment(symbol, text[i - 1]) && !isString) {
            isComment = true;
            currentWord += symbol;
            isBlockComment = IsBlockComment(symbol, text[i - 1]);
        } else if (CommentStarts(symbol) && !isString && !isComment) {
            pushWordAddSymbol(symbol);
        } else if (CommentEnds(symbol) && isComment && !isString) {
            currentWord += symbol;
        } else if (IsClosingComment(symbol, text[i - 1]) && isBlockComment && !isString) {
            isComment = false;
            isBlockComment = false;
            pushWordWithSymbol(symbol);
        } else if (endWordSymbols.includes(symbol) && !isComment && !isString) {
            pushWordAndSymbol(symbol);
        } else {
            currentWord += symbol;
        }

    }

    if (currentWord !== "") {
        result.push(currentWord);
    }

    for (var j = 0; j < endWordSymbols.length; j++) {
        removeItemFromResult(endWordSymbols[j]); // removes ' '
    }

    return result;
}
/**
 * Strips out everything but the keywords from param words, then returns an object of just keywords. 
 * @param {Array} keywords
 * @param {Object} words
 * @returns object
 */
function getTheKeywords(keywords, words) {
    let result = [];
    /**
     * Removes any item from the result array that is received. 
     * Used to clean up items we wouldn't look for to provide hints
     * 
     * @param {string} item
     */
    function removeItemFromResult(item) {
        let myindex;
        while ((myindex = words.indexOf(item)) > -1) {
            result.push(words.splice(myindex, 1)[0]);
        }
    }
    for (var k = 0; k < keywords.length; k++) {
        removeItemFromResult(keywords[k]); // removes indice that is not a keyword
    }

    return result;
}

function CommentStarts(symbol) {
    switch (g_Language) {
        case "C#":
            if (symbol === '/') return true;
            break;
        case "Java":
            if (symbol === '/') return true;
            break;
        case "Python":
            if (symbol === '#') return true;
            break;
        case "R":
            if (symbol === '#') return true;
            break;
        case "SQL":
            if (symbol === '/') return true;
            break;
    }
    return false;

}

function CommentEnds(symbol) {
    switch (g_Language) {
        case "C#":
            if (symbol === '*') return true;
            break;
        case "Java":
            if (symbol === '*') return true;
            break;
        case "SQL":
            if (symbol === '*') return true;
            break;
    }
    return false;
}

function IsBlockComment(current, previous) {
    switch (g_Language) {
        case "C#":
            if ((previous === '/') && (current === '*')) return true;
            break;
        case "Java":
            if ((previous === '/') && (current === '*')) return true;
            break;
        case "SQL":
            if ((previous === '/') && (current === '*')) return true;
            break;
    }
    return false;
}

function IsOpeningComment(current, previous) {
    switch (g_Language) {
        case "C#":
            if ((previous === '/') && ((current === '*') || (current === '/'))) return true;
            break;
        case "Java":
            if ((previous === '/') && ((current === '*') || (current === '/'))) return true;
            break;
        case "Python":
            if ((previous === '#')) return true;
            break;
        case "R":
            if ((previous === '#')) return true;
            break;
        case "SQL":
            if ((previous === '/') && (current === '*')) return true;
            break;
    }
    return false;
}

function IsClosingComment(current, previous) {
    switch (g_Language) {
        case "C#":
            if ((previous === '*') && (current === '/')) return true;
            break;
        case "Java":
            if ((previous === '*') && (current === '/')) return true;
            break;
        case "SQL":
            if ((previous === '*') && (current === '/')) return true;
            break;
    }
    return false;
}

// node_walk: walk the element tree, stop when func(node) returns false
function node_walk(node, func) {
    var result = func(node);
    for (node = node.firstChild; result !== false && node; node = node.nextSibling)
        result = node_walk(node, func);
    return result;
};

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)
function getCaretPosition(elem) {
    var sel = window.getSelection();
    var cum_length = [0, 0];

    if (sel.anchorNode == elem)
        cum_length = [sel.anchorOffset, sel.extentOffset];
    else {
        var nodes_to_find = [sel.anchorNode, sel.extentNode];
        if (!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
            return undefined;
        else {
            var found = [0, 0];
            var i;
            node_walk(elem, function (node) {
                for (i = 0; i < 2; i++) {
                    if (node == nodes_to_find[i]) {
                        found[i] = true;
                        if (found[i == 0 ? 1 : 0])
                            return false; // all done
                    }
                }

                if (node.textContent && !node.firstChild) {
                    for (i = 0; i < 2; i++) {
                        if (!found[i])
                            cum_length[i] += node.textContent.length;
                    }
                }
            });
            cum_length[0] += sel.anchorOffset;
            cum_length[1] += sel.extentOffset;
        }
    }

    if (cum_length[0] <= cum_length[1])
        return cum_length;
    return [cum_length[1], cum_length[0]];
}

function SetCaretPosition(el, pos) {

    // Loop through all child nodes
    for (var node of el.childNodes) {
        if (node.nodeType == 3) { // we have a text node
            if (node.length >= pos) {
                // finally add our range
                var range = document.createRange(),
                    sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done
            } else {
                pos -= node.length;
            }
        } else {
            pos = SetCaretPosition(node, pos);
            if (pos == -1) {
                return -1; // no need to finish the for loop
            }
        }
    }
    return pos; // needed because of recursion stuff
}


//-----------------line numeration---------------------------------------


function NumerateLines() {
    var elem = document.getElementById('txtCode1');
    var divHeight = elem.scrollHeight -
        parseFloat(window.getComputedStyle(elem, null).getPropertyValue('padding-top')) -
        parseFloat(window.getComputedStyle(elem, null).getPropertyValue('padding-bottom'));

    var linesDiv = document.getElementById('lines');
    linesDiv.innerHTML = ""; //remove previous lines

    var firstLine = AddNewLine(linesDiv, 1);
    var lines = elem.innerHTML.split('\n');
    var numberOfLines = lines.length;

    for (var i = 2; i <= numberOfLines; i++) {
        AddNewLine(linesDiv, i);
    }
    linesDiv.scrollTop = elem.scrollTop;

    ShowErrors();
    UnderlineErrorLines(elem);
}

function ShowErrors() {
    if ((errors == null) || (errors.length == 0))
        return;

    var divs = document.getElementById('lines').children;
    for (var i = 0; i < errors.length; i++) {
        if (errors[i].type != "error") continue;

        var line = errors[i].line;
        if (line < 1 || line > divs.length)
            continue;

        var lineDiv = divs[line - 1];
        lineDiv.className += " text-danger";
        lineDiv.textContent = "*";
    }
}

function AddNewLine(parentDiv, lineNumber) {
    var newLine = document.createElement("div");
    newLine.appendChild(document.createTextNode(lineNumber));
    newLine.className = "numerated-line";
    parentDiv.appendChild(newLine);
    return newLine;
}

function OnScroll(div) {
    var linesDiv = document.getElementById('lines');
    linesDiv.scrollTop = div.scrollTop;
}
//------------------------------Download Function----------------------------
function DownloadSubmitedFile(fileType) {
    //var base64Result = SubmittedFIle;
    var anchor_href;
    var fileName;
    if (fileType == "Excel") {
        anchor_href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + SubmittedFIle;
        fileName = "ExcelFile.xlsx";
    }
    else if (fileType == "Image") {
        anchor_href = "data:image/png;base64," + SubmittedFIle;
        fileName = "imageFile.png";
    }
    const exportLinkElement = document.createElement('a');
    exportLinkElement.hidden = true;
    exportLinkElement.download = fileName;
    exportLinkElement.href = anchor_href;
    exportLinkElement.text = "downloading...";

    document.body.appendChild(exportLinkElement);
    exportLinkElement.click();
    exportLinkElement.remove();

}

//-----------------------------------------------------
function SubmitFile() {
    if (IsFileUploadProblem) {
        const Upfile = document.getElementById("fileUpload").files;
        if (Upfile.length == 0) {
            document.getElementById("lblFileUploadError").innerHTML = "The File field cannot be left blank.<br/> Please submit a supported file.";
            return false;
        }
        else {
            document.getElementById("lblFileUploadError").innerText = "";
            if (isValidFileType()) {
                RunCode();
                FileLoadAfterSubmit();
            } else {
                var extension = document.getElementById("FileExtension").innerText;
                document.getElementById("lblFileUploadError").innerHTML = "The File extension is not supported. <br/> Please submit a " + extension + " file.";
            }
        }
    }
}

function isValidFileType() {
    const fileType = document.getElementById("fileUpload").files[0].type;
    var fileName = document.getElementById("fileUpload").files[0].name;
    var index = fileName.split(".").length - 1
    var type2 = fileName.split(".")[index];
    if (g_Language == "Tableau") {
        return (type2 == "tbw");
    } else if (g_Language == "Excel") {
        return (fileType == "application/vnd.ms-excel"
            || fileType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type2 == "xlsx" || type2 == "xls");
    } else if (g_Language == "Image") {
        return (fileType == "image/jpeg" || fileType == "image/png" || type2 == "jpg" || type2 == "png");
    } else if (g_Language == "HTML") {
        return (fileType == "text/html" || type2 == "html");
    } else {
        return false;
    }
}

function FileLoadAfterSubmit() {
    var file = "";
    var fr = "";
    const files = document.getElementById("fileUpload").files;
    if (files.length > 0 && (g_Language == "Tableau" || g_Language == 'HTML')) {
        file = files[0];
        fr = new FileReader();
        fr.readAsText(file);
        fr.onload = fcontent => {
            SubmittedFIle = fcontent.target.result;
        }
    } else if (files.length > 0 && (g_Language == "Excel" || g_Language == "Image")) {

        file = files[0];
        fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = fcontent => {
            SubmittedFIle = GetFileBase64String(fcontent.target.result);
        }
    }
}
