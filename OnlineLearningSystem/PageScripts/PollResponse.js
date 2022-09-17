/*
Poll Response page
Revised by Humam Babi, 2022
*/

'use strict';

// Global variables
var g_itemList = []; 

// When the page is loaded and ready
$(document).ready(function () {
    loadPollResponse();

    $("#submit-answers").click(function() {
        SubmitAnswers();
    });
});


///////////////////////////////////////////////////////////////////////////////////////////////////
function loadPollResponse() {
    const data = {
        CourseInstanceId: GetFromQueryString("courseInstanceId"),
        ModuleObjectiveId: GetFromQueryString("moduleObjectiveId"),
        PollGroupId: GetFromQueryString("pollGroupId"),
        ModuleId: GetFromQueryString("moduleId"),
        Method: "Get"
    };

    fetchFunction("PollResponse", data).then(d => {
        //console.log(d); // For debugging only!
        var iQuestionCount = typeof(d.QuestionItems) != 'object' ? 0 : d.QuestionItems.length;
        var iAnsweredCount = iQuestionCount < 1 ? 0 :  d.QuestionItems.filter(x => x.PollAnswers.length > 0).length;

        // Set the title
        $("#poll-title").text(d.Title);

        // Set the percentage of answered polls, and the progress bar
        var iPercentage = iQuestionCount == 0 ? 0 : parseInt((iAnsweredCount / iQuestionCount) * 100);
        $("#poll-grade").text(iPercentage.toString() + "%");
        if (iPercentage == 100) $("#poll-grade").addClass("full"); else $("#poll-grade").removeClass("full");
		$("#progress-poll-grade").css('width', iPercentage.toString() + "%");
		if (iPercentage == 100) $("#progress-poll-grade").addClass("full"); else $("#progress-poll-grade").removeClass("full");

        // Show/Hide the "Submit" button
        if (iPercentage < 100) {
            $("#submit-container").removeClass("d-none").addClass("d-flex");
        } else {
            $("#submit-container").removeClass("d-flex").addClass("d-none");
        }

        // Display poll questions
        var allPollQuestionsHtml = "";
        for (var i = 0; i < iQuestionCount; i++) {
            var pollItem = d.QuestionItems[i];

            var clsItem = "pollitem" + (pollItem.isOption ? "" : " textarea");

            // Add only the un-answered polls
            if (typeof(pollItem.PollAnswers) != 'object' || pollItem.PollAnswers.length < 1) {
                g_itemList.push({id: pollItem.PollQuestionId, isMultipleChoice: pollItem.isOption});
            }

            var answerHtml = "";
            if (pollItem.isOption) {
                // Poll Question type is Option
                var lblLeast = pollItem.PollOptions[pollItem.PollOptions.length - 1].Title, lblMost = pollItem.PollOptions[0].Title;
                var clsDisEn = typeof(pollItem.PollAnswers) != 'object' ? " active" : (pollItem.PollAnswers.length > 0 ? "" : " active");
                var optionsHtml = "", answerListIds = [], optionIdList = [];

                // Build list of answers (if there any)
                if (typeof(pollItem.PollAnswers) == 'object' && pollItem.PollAnswers.length > 0) {
                    for (j = 0; j < pollItem.PollAnswers.length; j++) {
                        answerListIds.push(pollItem.PollAnswers[j].PollOptionId);
                    }
                }

                // Build list of option Ids
                for (var j = 0; j < pollItem.PollOptions.length; j++) {
                    optionIdList.push(pollItem.PollOptions[j].PollOptionId);
                }

                // Create options DOM
                for (var j = 0; j < pollItem.PollOptions.length; j++) {
                    var optionId = pollItem.PollOptions[j].PollOptionId;
                    var clsSelected = "", clickEvent = "";

                    for (var k = 0; k < answerListIds.length; k++) {
                        if (answerListIds[k] == optionId) { clsSelected = " selected"; break; }
                    }

                    clickEvent = clsDisEn.length > 0 ? `SelectOption(${optionId}, [${optionIdList}], ${pollItem.PollQuestionId})` : "";

                    optionsHtml += `
                        <div
                            class="pollanswer-optionitem${clsDisEn}${clsSelected}"
                            id="QID${pollItem.PollQuestionId}_OID${optionId}"
                            onclick="${clickEvent}"
                        >${(j + 1).toString()}</div>
                    `;
                }

                answerHtml = `
                    <div class="answeroption-container">
                        <div class="d-flex justify-content-center d-md-none">
                            <div class="answeroption-leastlabel">${lblLeast}</div>
                        </div>
                        <div class="d-flex flex-column align-items-center flex-md-row" id="QID${pollItem.PollQuestionId}">
                            ${optionsHtml}
                        </div>
                        <div class="d-flex justify-content-center justify-content-md-between">
                            <div class="answeroption-leastlabel d-none d-md-block">${lblLeast}</div>
                            <div class="answeroption-mostlabel">${lblMost}</div>
                        </div>
                    </div>
                `;
            } else {
                // Poll Question type is Text
                var txtPropDisEn = typeof(pollItem.PollAnswers) != 'object' ? "" : (pollItem.PollAnswers.length > 0 ? " disabled" : "");
                var answerText = "";

                if (typeof(pollItem.PollAnswers) == 'object' && pollItem.PollAnswers.length > 0) {
                    for (var j = 0; j < pollItem.PollAnswers.length; j++) {
                        if (pollItem.PollAnswers[j].Answer != undefined && pollItem.PollAnswers[j].Answer.length > 0) {
                            answerText += (answerText.length == 0 ? "" : "\r\n") + pollItem.PollAnswers[j].Answer;
                        }
                    }
                }

                answerHtml = `
                    <div class="answertext-container">
                        <div class="textarea-container">
                            <textarea
                                class="textbox"
                                id="QID${pollItem.PollQuestionId}"
                                rows="5"
                                placeholder="Type Here..."${txtPropDisEn}
                            >${answerText}</textarea>
                        </div>
                        <div><i class="fa-solid fa-circle-exclamation"></i>&nbsp;<span></span></div>
                    </div>
                `;
            }

            // Add this poll question to the page polls
            allPollQuestionsHtml += `
                <div class="${clsItem}">
                    <div class="pollitem-title">Question ${(i + 1).toString()}</div>
                    <div class="pollitem-questiontext">${pollItem.PollQuestion}</div>
                    ${answerHtml}
                </div>
            `;
        }

        $("#pnlQuestions").html(allPollQuestionsHtml);

        // Copied from PageScripts\UserInterface. Needed after dynamic adding to the DOM.
        $("input.textbox, textarea.textbox").on('focus', function () {
            $(this).parent().addClass("active");
        });
        $("input.textbox, textarea.textbox").on('blur', function () {
            $(this).parent().removeClass("active");
        });
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function SelectOption(optionItem, optionArray, questionID) {
    for (var i = 0; i < optionArray.length; i++) {
        const optionElmID = `QID${questionID}_OID${optionArray[i]}`;
        
        if (optionArray[i] == optionItem) {
            $(`#${optionElmID}`).addClass("selected");
        } else {
            $(`#${optionElmID}`).removeClass("selected");
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function alertAnswertAll() {
    const styledSwal = Swal.mixin({
        buttonsStyling: false,
        customClass: {
            popup: 'swal-poll-popup',
            htmlContainer: 'swal-poll-htmlcontainer',
            actions: 'swal-poll-actions',
            confirmButton: 'button solid swal-confirmclose-button',
        }
    });

    styledSwal.fire({
        text: 'Sorry! You must answer all \'multiple-choice\' questions!',
        icon: 'warning',
        confirmButtonText: 'OK',
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function SubmitAnswers() {
    $("#disabled-div").css('display', "block"); // Disable page

    var dataPollResponse = [];

    for (var i in g_itemList) {
        var id = g_itemList[i].id;

        if (g_itemList[i].isMultipleChoice) {
            var elmId = $(`#QID${id}`).children(".pollanswer-optionitem.selected");

            if (elmId.length < 1) {
                alertAnswertAll();
                $("#disabled-div").css('display', "none"); // Re-enable page
                return false;
            }

            var strOptID = elmId.prop('id');
            var sepPos = strOptID.indexOf('_OID');
            var optID = parseInt(strOptID.substr(sepPos + 4));

            dataPollResponse.push({ PollQuestionId: id, OptionId: optID, TextAnswer: "" });
        } else {
            var elmId = $(`#QID${id}`);

            if (elmId.length > 0 && elmId.val().trim().length > 0) {
                dataPollResponse.push({ PollQuestionId: id, OptionId: null, TextAnswer: elmId.val().trim() });
            }
        }
    }

    $("#disabled-div").css('display', "none"); // Re-enable page
    if (dataPollResponse.length > 0) {
        $("#loader-spinner").css('display', "");
        PostSubmitedData(dataPollResponse)
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function PostSubmitedData(pollResponseData) {
    const data = {
        CourseInstanceId: GetFromQueryString("courseInstanceId"),
        ModuleObjectiveId: GetFromQueryString("moduleObjectiveId"),
        PollGroupId: GetFromQueryString("pollGroupId"),
        StudentResponses: pollResponseData,
        Method: "Add"
    };

    fetchFunction("PollResponse", data).then(d => {
        Navigate("PollResponse.html");
    });
}
