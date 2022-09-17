'use strict';

var submitCount = 0;
var player;
var shift = 0;


///////////////////////////////////////////////////////////////////////////////////////////////////
function setRating(value, qIndex) {
    /* There are two feedback sections. Set them both (classes instead of IDs) */
    const thumbUp = $("." + qIndex + "RateUp"), thumbDown = $("." + qIndex + "RateDown");

    thumbDown.prop('src', "../Content/images/thumb-down-normal.png");
    thumbUp.prop('src', "../Content/images/thumb-up-normal.png");

    //thumbUp.disabled = value == 1;
    //thumbDown.disabled = value == -1;

    if (value == 1) {
        thumbUp.prop('src', "../Content/images/thumb-up-selected.png");
        thumbUp.click(() => { sendRating(0, qIndex) });
        thumbDown.click(() => { sendRating(-1, qIndex) });
    }
    else if (value == -1) {
        thumbDown.prop('src', "../Content/images/thumb-down-selected.png");
        thumbDown.click(() => { sendRating(0, qIndex) });
        thumbUp.click(() => { sendRating(1, qIndex) });
    }
    else if (value == 0) {
        thumbUp.click(() => { sendRating(1, qIndex) });
        thumbDown.click(() => { sendRating(-1, qIndex) });
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function disableMultipleChoice(qIndex, questionType) {
    if (questionType == "Checkbox" || questionType == "Radio") {
        var inputs = document.getElementById(qIndex + 'multipleChoice').getElementsByTagName('INPUT');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].setAttribute("disabled", "disabled");
        }
    } else if (questionType == "Dropdown") {
        document.getElementById(qIndex + "txtAnswer").style.display = "";
        document.getElementById(qIndex + "txtAnswer").contentEditable = false;
        document.getElementById(qIndex + "ddAnswer").style.display = "none";
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function checkAnswerExact(userAnswer, expectedAnswer, caseSensitivity) {
    if (caseSensitivity) {
        return (userAnswer === expectedAnswer);
    } else {
        return (userAnswer.trim().toLowerCase() == expectedAnswer.trim().toLowerCase());
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setAnswerRevealElement(qIndex) {
    const svgReveal = '<svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.03938 10.125H7.96M6.5 1.375V2M10.4775 3.0225L10.0356 3.46437M12.125 7H11.5M1.5 7H0.875M2.96437 3.46437L2.5225 3.0225M4.29 9.21C3.85304 8.77293 3.5555 8.2161 3.43499 7.60994C3.31447 7.00377 3.37641 6.37548 3.61296 5.80451C3.8495 5.23354 4.25004 4.74553 4.76393 4.40218C5.27781 4.05884 5.88197 3.87558 6.5 3.87558C7.11803 3.87558 7.72219 4.05884 8.23607 4.40218C8.74996 4.74553 9.1505 5.23354 9.38705 5.80451C9.62359 6.37548 9.68553 7.00377 9.56501 7.60994C9.4445 8.2161 9.14696 8.77293 8.71 9.21L8.3675 9.55188C8.17169 9.74772 8.01638 9.98021 7.91043 10.2361C7.80448 10.492 7.74996 10.7662 7.75 11.0431V11.375C7.75 11.7065 7.6183 12.0245 7.38388 12.2589C7.14946 12.4933 6.83152 12.625 6.5 12.625C6.16848 12.625 5.85054 12.4933 5.61612 12.2589C5.3817 12.0245 5.25 11.7065 5.25 11.375V11.0431C5.25 10.4837 5.0275 9.94688 4.6325 9.55188L4.29 9.21Z" stroke="#F15656" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const svgCorrect = '<svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.9375 6.3125L5.3125 10.6875L14.0625 1.3125" stroke="#7DC237" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const svgRevealed = '<svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5625 0.9375L1.4375 9.0625M1.4375 0.9375L9.5625 9.0625" stroke="#ECAD0F" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    let jqElm = $("#" + qIndex + "btnReveal");
    let Q = g_Questions[qIndex];
    let bAlreadyAnswered = checkAnswerExact(Q.Answer, Q.ExpectedAnswer, Q.CaseSens);
    let bAnswerRevealed = Q.AnswerShown;

    if (bAnswerRevealed) {
        // Revealed
        jqElm.removeClass("reveal").removeClass("correct").addClass("revealed");
        jqElm.html(svgRevealed + "&nbsp;&nbsp;" + "Revealed Answer");
    } else {
        if (bAlreadyAnswered) {
            // Answered, and the answer wasn't revealed => Correct
            jqElm.removeClass("reveal").removeClass("revealed").addClass("correct");
            jqElm.html(svgCorrect + "&nbsp;&nbsp;" + "Correct Answer");
        } else {
            // Not answered yet, and the answer wasn't revealed => (Reveal) as a button
            jqElm.removeClass("correct").removeClass("revealed").addClass("reveal");
            jqElm.html(svgReveal + "&nbsp;&nbsp;" + "Reveal Answer");

            if (Q.Answer) {
                // Only when there is an answer, but neither correct nor revealed
                $("#" + qIndex + "txtAnswer").css('border-bottom-style', "none");
                $("#" + qIndex + "txtAnswer").css('min-width', "2.5rem");
                $("#" + qIndex + "txtAnswer").css('top', "1px");

                checkAnswerOnInput(qIndex, $("#" + qIndex + "txtAnswer")[0]);
            }
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setAnswerTextBoxStyle(qIndex) {
    let jqElm = $("#" + qIndex + "txtAnswer");
    let Q = g_Questions[qIndex];
    let bAlreadyAnswered = checkAnswerExact(Q.Answer, Q.ExpectedAnswer, Q.CaseSens);
    let bAnswerRevealed = Q.AnswerShown;

    if (bAnswerRevealed) {
        // Revealed
        jqElm.removeClass("correct").addClass("revealed");
        jqElm.css('border-bottom-style', "solid"); // Needed for after answer submission
    } else {
        if (bAlreadyAnswered) {
            // Answered, and the answer wasn't revealed => Correct
            jqElm.removeClass("revealed").addClass("correct");
            jqElm.css('border-bottom-style', "solid"); // Needed for after answer submission
        } else {
            // Not answered yet, and the answer wasn't revealed => (Normal)
            jqElm.removeClass("correct").removeClass("revealed");
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function showResult(grade, answerShown, answer, index, maxGrade, isMultipleChoice, questionType, hint, hintId = 0, hintRating = 0) {
    var show = !(grade > 0 || answerShown);

    if (answer.replaceAll('_', " ").trim().length > 0 && !isMultipleChoice) $("#" + index + "txtAnswer").html(answer);

    if (!isMultipleChoice) {
        $("#" + index + "txtAnswer").prop('contentEditable', show);
        if (!show) {
            $("#" + index + "ddAnswer").css('display', "none");
            $("#" + index + "txtAnswer").css('display', "");
        }
    } else if (!show) {
        disableMultipleChoice(index, questionType);
    }

    var lblResult = $("#" + index + "question-points"); // Question's results (grade points)

    if (window.location.href.includes("Material")) {
        lblResult.text("Step " + (g_CurrentQuestion + 1) + "/" + g_Questions.length + " (" + grade + " / " + maxGrade + " Points");
    } else {
        lblResult.text(grade + " / " + maxGrade + " Points");
        g_Questions[index].hintId = (hint) ? hintId : 0
    }

    setAnswerRevealElement(index);
    setAnswerTextBoxStyle(index);

}


///////////////////////////////////////////////////////////////////////////////////////////////////
function choiceChecked(checked, choice) {
    for (let i = 0; i < checked.length; i++) {
        if (checked[i] == choice) return true;
    }

    return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setCheckbox(choices, index, answer, inputType) {
    if (choices == null || choices.length == 0) return;
    
    var answers = (answer != null) ? answer.split(",") : [];
    var container = document.getElementById(index + 'multipleChoice');

    for (let i = 0; i < choices.length; i++) {
        var choiceId = choices[i].Id + 'choice'; //index + 'choice' + i;
        var checkbox = document.createElement('input');

        checkbox.type = inputType;
        checkbox.id = choiceId;
        checkbox.value = choiceId;

        if (inputType == 'radio') checkbox.name = index + inputType;
        if (choiceChecked(answers, choices[i].Id)) checkbox.setAttribute("checked", "true");

        var label = document.createElement('label');
        label.htmlFor = choiceId;
        label.innerHTML = choices[i].Option;

        var br = document.createElement('br');

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(br);
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function extractChoiceId(choiceId) {
    var end = choiceId.indexOf("choice");
    return (end != -1) ? choiceId.substring(0, end) : -1;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setCorrectAnswer(index, answer, questionType) {
    var choices = g_Questions[index].Options;
    if (choices == null || choices.length == 0) return;

    if (questionType == "Dropdown") {
        const txtAnswer = document.getElementById(index + "txtAnswer");
        for (let i = 0; i < choices.length; i++) {
            if (choices[i].Id == answer) {
                txtAnswer.textContent = choices[i].Option;
                break;
            }
        }
    } else if (questionType == "Checkbox" || questionType == "Radio") {
        var answers = (answer != null) ? answer.split(",") : [];
        var inputs = document.getElementById(index + 'multipleChoice').getElementsByTagName('INPUT');

        for (var i = 0; i < inputs.length; i++) {
            if (choiceChecked(answers, extractChoiceId(inputs[i].id))) {
                inputs[i].checked = true;
            } else {
                inputs[i].checked = false;
            }
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function clearOptions(select) {
    for (var i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setDropDown(choices, grade, answerShown, index, answer) {
    const txtAnswer = $("#" + index + "txtAnswer");
    const ddAnswer = $("#" + index + "ddAnswer"), elmSelect = ddAnswer[0];

    clearOptions(elmSelect);

    if (choices == null || choices.length == 0) {
        txtAnswer.css('display', "");
        ddAnswer.css('display', "none");
    }
    else {
        if (!answerShown && grade == 0) {
            txtAnswer.css('display', "none");
            ddAnswer.css('display', "");

            elmSelect.add(document.createElement('option'));
            for (let i = 0; i < choices.length; i++) {
                var option = document.createElement('option');
                option.text = choices[i].Option;
                option.value = choices[i].Id;
                if (answer == choices[i].Id) option.selected = true;
                elmSelect.add(option);
            }
        } else {
            setCorrectAnswer(index, answer, "Dropdown");
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function assignCSS(qData, appendage) {
    if (typeof (qData.Color) != 'undefined') $("#" + appendage + "txtAnswer").css('color', qData.Color);
    if (typeof (qData.FontFamily) != 'undefined') $("#" + appendage + "txtAnswer").css('font-family', qData.FontFamily);
    if (typeof (qData.FontSize) != 'undefined') $("#" + appendage + "txtAnswer").css('font-size', qData.FontSize);
    if (typeof (qData.BackgroundColor) != 'undefined') $("#" + appendage + "txtAnswer").css('background-color', qData.BackgroundColor);
    if (typeof (qData.Border) != 'undefined') $("#" + appendage + "txtAnswer").css('border', qData.Border);
    if (typeof (qData.PaddingLeft) != 'undefined') $("#" + appendage + "txtAnswer").css('padding-left', qData.PaddingLeft);
    if (typeof (qData.PaddingRight) != 'undefined') $("#" + appendage + "txtAnswer").css('padding-right', qData.PaddingRight);
    $("#" + appendage + "txtAnswer")[0].className = "";
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function getQuestion(qIndex) {
    var Q = g_Questions[qIndex]; // From Quiz.js

    //console.log(Q);

    g_CurrentQuestion = qIndex;
    g_AnswerHistory[qIndex] = ""; // Initialize the history for this question

    if (window.location.href.includes("MaterialPage")) qIndex = 0;

    $("#" + qIndex + "lblPrompt1").text(Q.Prompt1);
    $("#" + qIndex + "lblPrompt2").text(Q.Prompt2);

    // Display question's image (if exists)
    if (Q.Images != null) {
        $("#" + qIndex + "questionImage").html(Q.Images);
    } else {
        $("#" + qIndex + "questionImage").css('display', "none");
    }

    var element = $("#" + qIndex + "textbox");
    if (Q.EmbedAction) {
        element.css('position', "absolute");
        assignCSS(Q, qIndex);

        if (Q.Type == "Click") {
            element = $("#" + qIndex + "elementArea");
        }
        else if (Q.Type == "Dropdown") {
            setDropDown(Q.Options, Q.Grade, Q.AnswerShown, qIndex, Q.Answer);
            element = $("#" + qIndex + "textbox");
        }
        else if (Q.Type == "Textbox") {
            element = $("#" + qIndex + "textbox");
        }
    }
    else if (Q.Type == "Dropdown") {
        setDropDown(Q.Options, Q.Grade, Q.AnswerShown, qIndex, Q.Answer);
    } else if (Q.Type == "Checkbox" || Q.Type == "Radio") {
        $("#" + qIndex + "multipleChoice").css('display', "");
        setCheckbox(Q.Options, qIndex, Q.Answer, Q.Type.toLowerCase());

        $("#" + qIndex + "txtAnswer").css('display', "none");
        $("#" + qIndex + "ddAnswer").css('display', "none");
    }

    showResult(Q.Grade, Q.AnswerShown, Q.Answer, qIndex, Q.MaxGrade, Q.IsMultipleChoice, Q.Type, "");
    setRating(Q.QuestionRating, qIndex);

    if (Q.VideoSource != null) {
        videoSetup(qIndex, Q.VideoTimestamp, Q.VideoSource, element, Q.EmbedAction, (Q.Answer == Q.ExpectedAnswer));
    }

    if (Q.PositionX != -1) element.css('left', Q.PositionX + "px");
    if (Q.PositionY != -1) element.css('top', Q.PositionY + "px");
    if (Q.Width != -1) element.css('width', Q.Width + "px");
    if (Q.Height != -1) element.css('height', Q.Height + "px");

    return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function putChoice(index) {
    submitCount += 1

    const select = document.getElementById(index + "ddAnswer");
    const txtAnswer = document.getElementById(index + "txtAnswer");

    //if (submitCount > 4) document.getElementById(index + "btnSubmit").style.display = "none";

    txtAnswer.value = select.options[select.selectedIndex].text;
    submitAnswer(index, select.options[select.selectedIndex].value);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function getAnswers(index) {
    var answers = [];
    var labels = document.getElementById(index + 'multipleChoice').getElementsByTagName('LABEL');

    for (var i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor != '') {
            var choiceId = labels[i].htmlFor;
            var input = document.getElementById(choiceId);

            if (input.checked) answers.push(extractChoiceId(choiceId));
        }
    }

    return answers.join();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function clickSubmit(index) {
    submitAnswer(index, g_Questions[g_CurrentQuestion].ExpectedAnswer);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function revealClick(index) {
    if (window.location.href.includes("Quiz")) g_CurrentQuestion = index;
    document.getElementById("disabled-div").style.display = "block";

    if (!confirm("Revealing the answer will deduct points from your grade.  Are you sure you wish to reveal the answer?")) {
        document.getElementById("disabled-div").style.display = "none";
        return false;
    }

    const data = {
        History: g_AnswerHistory[g_CurrentQuestion]
    };

    g_AnswerHistory[g_CurrentQuestion] = "";

    getData("Reveal", data, g_CurrentQuestion).then(d => {
        g_Questions[g_CurrentQuestion].AnswerShown = true;
        g_Questions[g_CurrentQuestion].Answer = d.Answer;
        g_Questions[g_CurrentQuestion].Grade = 0;
        var questionType = g_Questions[g_CurrentQuestion].Type;
        setCorrectAnswer(g_CurrentQuestion, d.Answer, questionType);
        showResult(0, true, d.Answer, index, d.MaxGrade, g_Questions[g_CurrentQuestion].IsMultipleChoice, questionType, "");

        if (window.location.href.includes("Material")) {
            document.getElementById(index + "textbox").style.display = "none";
            nextStep(index);
        }

        document.getElementById("disabled-div").style.display = "none";
    });

    //hideHint(index);
    return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function submitAnswer(index, answer) {
    if (window.location.href.includes("Quiz")) g_CurrentQuestion = index;
    $("#disabled-div").css('display', "block");

    if (!answer || answer.length == 0) {
        if (document.getElementById(index + "multipleChoice").style.display == "none") {
            answer = document.getElementById(index + "txtAnswer").innerHTML;
        } else {
            answer = getAnswers(index);
        }
    }

    if (!answer) return;
    answer = answer.replaceAll('_', " ").trim();
    if (answer.length < 1) return;

    const data = {
        Answer: answer,
        Location: window.location.href,
        History: g_AnswerHistory[g_CurrentQuestion]
    };

    g_AnswerHistory[g_CurrentQuestion] = "";

    //console.log("Submitting: " + answer);

    getData("Submit", data, g_CurrentQuestion).then(d => {
        g_Questions[g_CurrentQuestion].Answer = answer;
        g_Questions[g_CurrentQuestion].Grade = d.Grade;
        var questionType = g_Questions[g_CurrentQuestion].Type;
        if (questionType == "Dropdown") setCorrectAnswer(g_CurrentQuestion, answer, questionType);
        showResult(d.Grade, false, answer, index, d.MaxGrade, g_Questions[g_CurrentQuestion].IsMultipleChoice, questionType, d.Hint, d.HintId, d.HintRating);

        if (window.location.href.includes("Material") && d.Grade > 0) {
            $("#" + index + "textbox").css('display', "none");
            nextStep(index);
        }

        // After submission, update the Quiz'es total grade (and its progress-bar)
        $("#quiz-grade").text(d.TotalGrade + "%");
        if (d.TotalGrade == 100) $("#quiz-grade").addClass("full"); else $("#quiz-grade").removeClass("full");
        $("#progress-quiz-grade").css('width', d.TotalGrade + "%");
        if (d.TotalGrade == 100) $("#progress-quiz-grade").addClass("full"); else $("#progress-quiz-grade").removeClass("full");

        $("#disabled-div").css('display', "none");
        //if (d.Grade != d.MaxGrade) $("#" + index + "lblHintTeacher").append("<b> Your submission has been received.</b>");
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function getData(controller, data, index) {
    data.QuestionId = g_Questions[index].Id;
    data.StudentId = localStorage.getItem("Hash");

    return fetchFunction(controller, data);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function sendRating(clientRating, index) {
    const data = {
        rating: clientRating,
    };

    getData("QuestionRating", data, index);

    setRating(clientRating, index);
    return false;
}


function sendRatingHint(clientRating, index) {
    const data = {
        rating: clientRating,
        hintId: g_Questions[index].hintId
    };

    getData("HintRating", data, index);

    setRatingHint(clientRating, index);
    return false;
}


function setRatingHint(value, index) {
    const thumbUp = document.getElementById(index + "HintRateUp");
    const thumbDown = document.getElementById(index + "HintRateDown");

    thumbDown.src = "../Content/images/thumb-down-normal.png"
    thumbUp.src = "../Content/images/thumb-up-normal.png";

    thumbUp.disabled = value == 1;
    thumbDown.disabled = value == -1;

    if (value == 1) {
        thumbUp.src = "../Content/images/thumb-up-selected.png";
    }
    else if (value == -1) {
        thumbDown.src = "../Content/images/thumb-down-selected.png";
    }
}


// ==========  Video Stuff ============
var TIMESTAMP;
function videoSetup(index, timestamp, source, element, embedded, answered) {
    TIMESTAMP = timestamp;


    document.getElementById(index + "videoPanel").style.display = "";

    if (player == null) {
        var Options = {
            url: source,
            controls: false,
            width: 1024
        };

        player = new Vimeo.Player(index + "videoPanel", Options);
    }

    if (embedded) {
        document.getElementById(index + "lblPrompt1").style.display = "none";
        document.getElementById(index + "lblPrompt2").style.display = "none";

        //document.getElementById(index + "btnSubmit").style.display = "none";
        element.style.display = "none";

        player.getCuePoints().then(function (cuePoints) {
            let cuePointExists = false;
            for (let i = 0; i < cuePoints.length; i++) {
                if (cuePoints[i].time == timestamp) {
                    cuePointExists = true;
                    break;
                }
            }
            if (!cuePointExists) {
                player.addCuePoint(timestamp, { customKey: timestamp });
                player.on('cuepoint', () => pauseVideo(event, element, timestamp, index, answered));
            }
        });

    }
    player.on('play', () => play(index, embedded));
}

function pauseVideo(event, element, timestamp, index, answered) {

    if (event.data.data.time == timestamp) {
        player.pause();
        element.style.display = "";
        answered = (g_Questions[g_CurrentQuestion].Answer == g_Questions[g_CurrentQuestion].ExpectedAnswer);
        if (answered) {
            setTimeout(play(index, true), 150);
            nextStep(index);
        }
        else {
            document.getElementById("btnPause1").disabled = true;
            document.getElementById(index + "lblPrompt1").style.display = "";
            document.getElementById(index + "lblPrompt2").style.display = "";
            document.getElementById("btnRepeat1").style.visibility = "visible";
            document.getElementById("btnReveal1").style.visibility = "visible";
        }

    }
}

function pause() {
    player.getPaused().then(function (paused) {
        if (!paused) {
            player.pause();
            document.getElementById("btnPause1").value = "Play";
        } else {
            player.play();
            document.getElementById("btnPause1").value = "Pause";
        }

    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function play(index, embedded) {
    $("#playVideo").css('display', "none");
    $("#elementArea").css('display', "none");
    $("#" + index + "lblPrompt1").css('display', "none");
    $("#" + index + "lblPrompt2").css('display', "none");
    $("#btnPause1").prop('disabled', false);
    $("#btnForward1").prop('disabled', (g_CurrentQuestion >= g_Questions.length - 1));
    $("#btnReset1").prop('disabled', false);
    
    if (embedded) $("#" + index + "textbox").css('display', "none");
    if (player) player.play();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function rememberNavKey(index, event) {
    if (window.location.href.includes("Quiz")) g_CurrentQuestion = index;

    // Navigation keys: right arrow, left arrow, Delete, backspace
    // Codes in database:
    // Backspace    BS   (8)
    // Delete       DL   (46)
    // Right arrow  RA   ()
    // Left arrow   LA   ()

    if ((event.keyCode == 46) || (event.keyCode == 8)) {
        // Delete & backspace
        submitCount += 1;

        const txtbox = document.getElementById(index + "txtAnswer");
        var indexToRemove = 0, keyCode = "";

        if (event.keyCode == 46) {
            if (shift == 0) {
                return;
            } else {
                indexToRemove = txtbox.textContent.length + shift;
                shift++;
            }
            keyCode = "DL";
        } else if (event.keyCode == 8) {
            if (txtbox.textContent.length == Math.abs(shift)) {
                return;
            } else {
                indexToRemove = txtbox.textContent.length + shift - 1;
            }
            keyCode = "BS";
        }

        const currentAnswer = txtbox.textContent.slice(0, indexToRemove) + txtbox.textContent.slice(indexToRemove + 1);
        g_AnswerHistory[g_CurrentQuestion] += keyCode + ",";
        g_CurrentAnswerList[g_CurrentQuestion] = currentAnswer;
    } else if (event.keyCode == 37) {
        // Left arrow ---------------------------
        var answer = document.getElementById(index + "txtAnswer").textContent;

        if (Math.abs(shift) < answer.length) {
            g_AnswerHistory[g_CurrentQuestion] += "LA,";
            shift--;
        }
    } else if (event.keyCode == 39) {
        // Right arrow --------------------------
        var answer = document.getElementById(index + "txtAnswer").textContent;

        if (shift < 0) {
            g_AnswerHistory[g_CurrentQuestion] += "RA,";
            shift++;
        }
    }
}


function hideHint(index) {
    $("#" + index + "lblHint").css('visibility', "hidden");
    shift = 0;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function rememberCharInput(qIndex, event) {
    if (event.keyCode == 13) { // "Enter" key
        event.preventDefault();
        return;
    }

    const txtbox = $("#" + qIndex + "txtAnswer");
    var currentAnswer = txtbox.text().replaceAll('_', " ").trim();

    if (currentAnswer.length > 30) {
        currentAnswer = currentAnswer.substring(31, 1);
        txtbox.text(currentAnswer);
        return false;
    }

    var char = event.which || event.keyCode;
    
    currentAnswer = getCurrentAnswer(currentAnswer, char);
    g_AnswerHistory[g_CurrentQuestion] += char + ",";
    g_CurrentAnswerList[g_CurrentQuestion] = currentAnswer;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function checkAnswerOnInput(qIndex, elm) {
    if (!g_Questions[qIndex].UsesHint) {
        const txtbox = $("#" + qIndex + "txtAnswer");
        var currentAnswer = txtbox.text().replaceAll('_', " ").trim();

        if (currentAnswer.length > 30) {
            currentAnswer = currentAnswer.substring(0, 31);
            txtbox.text(currentAnswer);
        }

        var editing = evaluateAnswer(currentAnswer, g_Questions[qIndex].ExpectedAnswer, g_Questions[qIndex].CaseSens);

        var pos = 0, cp = getCaretPosition(txtbox[0]);
        if (cp && typeof (cp[0]) != 'undefined') pos = cp[0];

        txtbox.html(getHint(currentAnswer, editing));

        // Only onInput()
        txtbox.css('border-bottom-style', "none");
        txtbox.css('min-width', "2.5rem");
        txtbox.css('top', "1px");

        if (typeof (cp) == 'undefined' || typeof (cp[0]) == 'undefined') pos = txtbox.text().length;
        setCaretPosition(txtbox[0], pos);

        currentAnswer = txtbox.text().replaceAll('_', " ").trim();
        if (editing == "") submitAnswer(qIndex, currentAnswer);
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function ignoreCharacter(code) {
    return (code < 32 || code > 126);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function getCurrentAnswer(text, character) {
    if (ignoreCharacter(character)) return text;

    if (shift != 0) {
        var position = text.length + shift;
        var output = text.substring(0, position) + String.fromCharCode(character) + text.substring(position);
        return output;
    } else {
        return text + String.fromCharCode(character);
    }
}



function nextStep(index, clicked) {
    if (!index) index = 0;
    g_CurrentQuestion += 1;
    //hideHint(index);

    var videoEnded = g_CurrentQuestion == g_Questions.length;
    document.getElementById("btnForward1").disabled = (g_CurrentQuestion >= g_Questions.length - 1);
    document.getElementById("btnPrev1").disabled = false;
    document.getElementById("btnPause1").disabled = false;
    document.getElementById("btnRepeat1").style.visibility = "hidden";

    if (videoEnded && localStorage.getItem("isDemo") == "true") navigateDemo();

    player.getPaused().then(function (paused) {
        if (paused) {
            play(index, true);
            document.getElementById("btnPause1").value = "Pause";
        }

        if (!videoEnded) getQuizQuestion();

        if (clicked) {
            var timestamp = getStepStartTime(g_CurrentQuestion);
            player.setCurrentTime(timestamp);
        }
    });
}


function prevStep() {
    g_CurrentQuestion -= 1;

    var ctSet = getStepStartTime(g_CurrentQuestion);

    player.getPaused().then(function (paused) {
        if (paused) {
            play(0, true);
            document.getElementById("btnPause1").value = "Pause";
        }

        document.getElementById("btnForward1").disabled = false;
        document.getElementById("btnPrev1").disabled = g_CurrentQuestion == 0;
        document.getElementById("btnPause1").disabled = false;
        document.getElementById("btnRepeat1").style.visibility = "hidden";
//        document.getElementById("btnReveal1").style.visibility = "hidden";

        getQuizQuestion();
        player.setCurrentTime(ctSet);
    });

}

function repeatQuestion() {


    player.getCurrentTime().then(function (seconds) {
        document.getElementById("btnRepeat1").disabled = true;
        play(0, true);
        player.setCurrentTime(seconds - 5);
    }).catch(function (error) {
        // an error occurred
    });

}

function getStepStartTime(index) {
    var prevQuestion = g_Questions[index - 1];
    if (prevQuestion == null) return 0;
    else return prevQuestion.VideoTimestamp + 1;
}

function reset() {

    g_CurrentQuestion = 0;
    document.getElementById("btnForward1").disabled = false;
    document.getElementById("btnPause1").disabled = false;
    document.getElementById("btnPrev1").disabled = true;
    document.getElementById("btnRepeat1").style.visibility = "hidden";
//    document.getElementById("btnReveal1").style.visibility = "hidden";

    player.getPaused().then(function (paused) {
        if (paused) play(0, true);
        getQuizQuestion();
        player.setCurrentTime(0);
    });

}


///////////////////////////////////////////////////////////////////////////////////////////////////
function getHint(answer, editing) {
    const colGreenCorrect = "#7DC237", colGrayGeneric = "#89959A", colRedWrong = "#F15656";

    if (editing == "") return "<span style='color: " + colGreenCorrect + ";'>" + answer + "<\/span>";

    var hint = "", answerIndex = 0;
    for (var i = 0; i < editing.length; i++) {
        if (editing.charAt(i) == "E") { // Correct character
            hint += "<span style='color: " + colGreenCorrect  + ";'>" + answer.charAt(answerIndex) + "<\/span>"
            answerIndex++;
        } else if (editing.charAt(i) == "C") { // Wrong character
            hint += "<span style='color: " + colRedWrong  + ";'>" + answer.charAt(answerIndex) + "<\/span>"
            answerIndex++;
        } else if (editing.charAt(i) == "D") { // Wrong and mispalced (marked with a line-through)
            hint += "<span style='color: " + colRedWrong + ";text-decoration:line-through;'>" + answer.charAt(answerIndex) + "<\/span>"
            answerIndex++;
        } else if (editing.charAt(i) == "I") { // A placeholder underscore '_'
            hint += "<span style='color: " + colGrayGeneric + ";'>_<\/span>"
        }
    }

    return hint;
}




// ---------- distance editing algorithm  -----------------

function diff(a, b) {
    if (a == b) {
        return 0;
    }
    else {
        return 1;
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function evaluateAnswer(currentAnswer, expectedAnswer, caseSensitive) {
    currentAnswer = currentAnswer.replace(String.fromCharCode(160), " "); //&nbsp;

    if (!caseSensitive) {
        currentAnswer = currentAnswer.toLowerCase();
        expectedAnswer = expectedAnswer.toLowerCase();
    }

    if (expectedAnswer == currentAnswer) return "";

    var expectedLength = expectedAnswer.length;
    var currentLength = currentAnswer.length;
    var d = Array.from(Array(currentLength + 1), () => new Array(expectedLength + 1));

    for (var i = 0; i < currentLength + 1; i++) {
        d[i][0] = i;
    }
    for (var j = 0; j < expectedLength + 1; j++) {
        d[0][j] = j;
    }

    var moves = Array.from(Array(currentLength + 1), () => new Array(expectedLength + 1));

    for (var i = 0; i < currentLength + 1; i++) {
        for (var j = 0; j < expectedLength + 1; j++) {
            if (i == 0 && j == 0)
                d[i][j] = 0;
            else if (i == 0) {
                d[i][j] = j;
                moves[i][j] = "I";
            }
            else if (j == 0) {
                d[i][j] = i;
                moves[i][j] = "D";
            }
            else {
                var c = diff(currentAnswer[i - 1], expectedAnswer[j - 1]);
                var res1 = d[i][j - 1] + 1;
                var res2 = d[i - 1][j] + 1;
                var res3 = d[i - 1][j - 1] + c;
                var result;

                if (res1 <= res2 && res1 <= res3) {
                    result = res1;
                    moves[i][j] = "I";
                } else {
                    if (res2 <= res3) {
                        result = res2;
                        moves[i][j] = "D";
                    } else {
                        result = res3;
                        moves[i][j] = (c == 0) ? "E" : "C";
                    }
                }

                d[i][j] = result;
            }
        }
    }

    var i = currentLength;
    var j = expectedLength;
    var editing = "";

    while (i > 0 || j > 0) {
        editing = moves[i][j] + editing;
        if (moves[i][j] == "I") {
            j--;
        } else if (moves[i][j] == "D") {
            i--;
        } else {
            i--;
            j--;
        }
    }

    return editing;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// node_walk(): Walk the element tree, stop when func(node) returns false
///////////////////////////////////////////////////////////////////////////////////////////////////
function node_walk(node, func) {
    var result = func(node);
    for (node = node.firstChild; result !== false && node; node = node.nextSibling)
        result = node_walk(node, func);
    return result;
};


///////////////////////////////////////////////////////////////////////////////////////////////////
// getCaretPosition(): Returns [start, end] as offsets to elem.textContent that correspond to
// the selected portion of text (if start == end, caret is at given position and no text is selected)
///////////////////////////////////////////////////////////////////////////////////////////////////
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

    if (cum_length[0] <= cum_length[1]) return cum_length;

    return [cum_length[1], cum_length[0]];
}


function createRange(node, chars, range) {
    if (!range) {
        range = document.createRange()
        range.selectNode(node);
        range.setStart(node, 0);
    }

    if (chars.count === 0) {
        range.setEnd(node, chars.count);
    } else if (node && chars.count > 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.length < chars.count) {
                chars.count -= node.textContent.length;
            } else {
                range.setEnd(node, chars.count);
                chars.count = 0;
            }
        } else {
            for (var lp = 0; lp < node.childNodes.length; lp++) {
                range = createRange(node.childNodes[lp], chars, range);

                if (chars.count === 0) {
                    break;
                }
            }
        }
    }

    return range;
}
function setCaretPosition(elm, chars) {
    if (chars >= 0) {
        var selection = window.getSelection();

        var range = createRange(elm, { count: chars });

        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}



/*====Demo Code====*/
function navigateDemo() {
    if (window.location.href.includes("Material")) {
        window.location.href = "QuizPage.html?questionSetId=" + d.Id;
    }
    else if (window.location.href.includes("Quiz")) {
        window.location.href = "Interaction.html?codingProblemId=83";
    }
}

