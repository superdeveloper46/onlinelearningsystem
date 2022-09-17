/*
Feedback page
Revised by Humam Babi, 2022
*/

'use strict';

// Global variables
var g_FeedbackList;


// Adjust the trim() method
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}

// When the page is loaded and ready
$(document).ready(function () {
    // Clear error message on input (also any validation error message will be cleared - see PageScripts/UserInterface.js)
    $(".textbox").on('input', function () {
        msgHide("msg-submission");
    });

    $("#a_support").prop('href', GetUrl("SupportTicket.html"));

    loadFeedbackList();
});


///////////////////////////////////////////////////////////////////////////////////////////////////
function loadFeedbackList() {
    // Show "loading" spinner
    $("#loader-spinner").css('display', "block");

    const data = {
        CourseInstanceId: GetFromQueryString("courseInstanceId"),
        Method : "GetList"
    };

    fetchFunction("Feedback", data).then(d => {
        //console.log(d); // Only for debugging!
        g_FeedbackList = d.FeedbackList;
        ShowFeedbackList();

        // Hide "loading" spinner
        $("#loader-spinner").css('display', "none");
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function ShowFeedbackList() {
    var html = "", bOnlyMine = $("#show-only-mine").prop('checked') ? true : false;

    for (var i = 0; i < g_FeedbackList.length; i++) {
        if (!bOnlyMine || (bOnlyMine && g_FeedbackList[i].IsMine)) {
            html += `
                <div class="feedback-list-item">${g_FeedbackList[i].Description}</div>
            `;
        }
    }

    if (!html.length) {
        html = `
            <div class="feedback-list-item no-feedbacks">
                <i class="fa-regular fa-comment-dots"></i>&nbsp;No feedbacks yet!
            </div>
        `;
    }

    $("#feedback-list-container").html(html);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function filterStudent() {
    msgHide("msg-submission");
    ShowFeedbackList();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function submitFeedback() {
    var strFeedbackText = $("#txtComment").val().trim();

    // Hide any success/failure messages from previous submission
    msgHide("msg-submission");

    // Validation
    if (strFeedbackText == "") {
        inputboxSetInvalid($("#txtComment"), "Sorry! The Comment field cannot be left blank.");
        return false;
    }

    // Disable the page
    $("#disabled-div").css('display', "block");

    const data = {
        CourseInstanceId: GetFromQueryString("courseInstanceId"),
        Feedback: $("#txtComment").val(),
        Method: "Save"
    };

    return fetchFunction("Feedback", data).then(d => {
        if (d == 1) {
            msgShow("msg-submission", "success", "Thank you for your feedback.");
            loadFeedbackList();
        } else {
            msgShow("msg-submission", "Sorry! The feedback submission failed.");
        }

        $("#txtComment").val("");

        // Re-enable the page
        $("#disabled-div").css('display', "none");
    });
}
