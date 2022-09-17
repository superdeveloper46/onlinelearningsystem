/*
Quiz.js
Revised by Humam Babi July 9, 2022

Note: This script is loaded *after* loading jQuery.
*/

'use strict';

// Global variables
var g_Questions, g_AnswerHistory, g_CurrentAnswerList, g_CurrentQuestion;

// Directly get quizzes
getQuiz();

///////////////////////////////////////////////////////////////////////////////////////////////////
function fetchGradableTextBox() {
    fetch("GradableTextBoxControl.html").then(res => res.text()).then(d => {
        if (window.location.href.includes("Quiz")) {
            for (var i = 0; i < g_Questions.length; i++) {
            var qData = d.replace(/x_/g, i);
            qData = qData.replace(/%qid%/g, g_Questions[i].Id);
                $("#pnlQuestions").append(qData);

                $("#" + i + "textbox").css('position', "relative");
                $("#" + i + "question-title").text("Question " + (i + 1));

                getQuestion(i); // In Question.js

                sessionStorage.setItem(`${i}lblPrompt1`, g_Questions[i].Prompt1);
                sessionStorage.setItem(`${i}Answer`, g_Questions[i].ExpectedAnswer);
                sessionStorage.setItem(`${i}lblPrompt2`, g_Questions[i].Prompt2);
            }
            InitializeEditables(); // In UserInterface.js
        } else {
            if ($("#pnlQuestion").html() == "") {
                var qData = d.replace(/x_/g, g_CurrentQuestion);
                qData = qData.replace(/%qid%/g, g_Questions[g_CurrentQuestion].Id);
                $("#pnlQuestion").html(qData);
            }

            getQuestion(g_CurrentQuestion); // In Question.js

            sessionStorage.setItem(`${i}lblPrompt1`, g_Questions[g_CurrentQuestion].Prompt1);
            sessionStorage.setItem(`${i}Answer`, g_Questions[g_CurrentQuestion].ExpectedAnswer);
            sessionStorage.setItem(`${i}lblPrompt2`, g_Questions[g_CurrentQuestion].Prompt2);
        }

        $("#loader-spinner").css('display', "none"); // Loader Spinner
        // Find fix for loader spinner to work in MaterialPage.html then move back here
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function getQuizQuestion() {
    fetchGradableTextBox();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function openMaterial(link) {
    window.open(link, '_blank');
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function displayMaterials(materials) {
    if (materials == null || materials.length == 0) return;

    var list = document.getElementById("quizMaterials");
    for (let i = 0; i < materials.length; i++) {
        var aElem = document.createElement("a");
        aElem.href = "#";
        aElem.setAttribute("onclick", "openMaterial('" + materials[i].Link + "')");
        var linkText = document.createTextNode(materials[i].Title);
        aElem.appendChild(linkText);
        list.appendChild(aElem);
        var br = document.createElement("br");
        list.appendChild(br);
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function getQuiz() {
    const data = {
        QuestionSetId: GetFromQueryString('questionSetId'),
        QuestionSetType: (window.location.href.includes("Material")) ? "Material" : "Quiz",
        CourseInstanceId: GetFromQueryString('courseInstanceId')
    };

    fetchFunction("Material", data).then(d => {
        console.log(d); // For debugging only!
        g_Questions = d.QuizQuestions;
        g_AnswerHistory = new Array(g_Questions.length);
        g_CurrentAnswerList = new Array(g_Questions.length);
        g_CurrentQuestion = 0;

        $("#quiz-title").text(d.Title);

        // Set the grade percentage and accordingly its color
        $("#quiz-grade").text(d.TotalGrade + "%");
        if (d.TotalGrade == 100) $("#quiz-grade").addClass("full"); else $("#quiz-grade").removeClass("full");

        // Set the grade progress-bar percentage and color
        $("#progress-quiz-grade").css('width', d.TotalGrade + "%");
        if (d.TotalGrade == 100) $("#progress-quiz-grade").addClass("full"); else $("#progress-quiz-grade").removeClass("full");

        displayMaterials(d.Materails);
        getQuizQuestion();
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function saveAllHistory() {
    if (!g_AnswerHistory) return;

    for (var i = 0; i < g_AnswerHistory.length; i++) {
        if (g_AnswerHistory[i] !== "") submitAnswer(i, g_CurrentAnswerList[i]);
    }
}
