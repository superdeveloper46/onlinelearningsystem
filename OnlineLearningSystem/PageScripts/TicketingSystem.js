/*
Support page
Revised by Humam Babi, 2022
*/

'use strict';

// Global definitions
const SORTBTN_ARROW_COLOR_ACTIVE = "#0092CE", SORTBTN_ARROW_COLOR_GRAYED = "#DEE0E0";
const SORT_NONE = 0, SORT_ASCENDING = 1, SORT_DESCENDING = 2;
const SORTMODE_STATUS = "S", SORTMODE_PRIORITY = "P";

var g_SupportTicketList;
var g_SortingMode;

// Adjust the trim() method
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}

// When the page is loaded and ready
$(document).ready(function () {
    // Initialize UI components
    g_SortingMode = SORTMODE_STATUS + SORT_DESCENDING;
    $("#a_feedback").attr('href', GetUrl("Feedback.html"));

    // Clear error message on input (also any validation error message will be cleared - see PageScripts/UserInterface.js)
    $(".textbox").on('input', function () {
        msgHide("msg-submission");
    });

    loadSupportTickets();
});


///////////////////////////////////////////////////////////////////////////////////////////////////
function ChangeSorting(Mode) {
    var curSortMode = g_SortingMode.substr(0, 1), curSortOrder = g_SortingMode.substr(-1, 1);
    var newSortOrder = SORT_NONE;

    // When sorting buttons are clicked
    clearTicketFormErrorMsgs();

    switch (Mode) {
        case SORTMODE_STATUS:
            if (curSortMode == SORTMODE_STATUS) {
                if (curSortOrder == SORT_ASCENDING) newSortOrder = SORT_DESCENDING;
                if (curSortOrder == SORT_DESCENDING) newSortOrder = SORT_ASCENDING;
            } else
            if (curSortMode == SORTMODE_PRIORITY) {
                newSortOrder = SORT_DESCENDING;
            }

            if (newSortOrder == SORT_NONE) newSortOrder = SORT_DESCENDING;
            g_SortingMode = SORTMODE_STATUS + newSortOrder;
            break;

        case SORTMODE_PRIORITY:
            if (curSortMode == SORTMODE_PRIORITY) {
                if (curSortOrder == SORT_ASCENDING) newSortOrder = SORT_DESCENDING;
                if (curSortOrder == SORT_DESCENDING) newSortOrder = SORT_ASCENDING;
            } else
            if (curSortMode == SORTMODE_STATUS) {
                newSortOrder = SORT_DESCENDING;
            }

            if (newSortOrder == SORT_NONE) newSortOrder = SORT_DESCENDING;
            g_SortingMode = SORTMODE_PRIORITY + newSortOrder;
            break;
    }

    SortTickets();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function SortTickets() {
    var sortMode = g_SortingMode.substr(0, 1), sortOrder = g_SortingMode.substr(-1, 1);

    // Apply the global variable mode of sorting on the UI
    if (sortMode == SORTMODE_STATUS) {
        setSortButton("filter-status", sortOrder);
        setSortButton("filter-priority", SORT_NONE);
    } else
    if (sortMode == SORTMODE_PRIORITY) {
        setSortButton("filter-priority", sortOrder);
        setSortButton("filter-status", SORT_NONE);
    }

    // Sort the global ticket list var
    if (g_SupportTicketList.length > 0) {
        g_SupportTicketList.sort(function(a, b) {
            if (sortMode == SORTMODE_STATUS) {
                if (sortOrder == SORT_ASCENDING) {
                    if (a.Status.toLowerCase() == "open" && b.Status.toLowerCase() != "open") return +1;
                    if (a.Status.toLowerCase() != "open" && b.Status.toLowerCase() == "open") return -1;
                    return 0;
                } else
                if (sortOrder == SORT_DESCENDING) {
                    if (a.Status.toLowerCase() != "open" && b.Status.toLowerCase() == "open") return +1;
                    if (a.Status.toLowerCase() == "open" && b.Status.toLowerCase() != "open") return -1;
                    return 0;
                }
            }
            if (sortMode == SORTMODE_PRIORITY) {
                var aP = a.Priority.toLowerCase(), bP = b.Priority.toLowerCase();
                var aPriority = aP == "high" ? 3 : (aP == "low" ? 1 : 2), bPriority = bP == "hight" ? 3 : (bP == "low" ? 1 : 2);

                if (sortOrder == SORT_ASCENDING) {
                    return aPriority - bPriority; // (+) if a > b, (-) if b > a, (0) if equal.
                } else
                if (sortOrder == SORT_DESCENDING) {
                    return bPriority - aPriority; // (+) if b > a, (-) if a > b, (0) if equal.
                }
            }
        });
    }

    // Replace tickets with new sorted ones
    ShowSupportTicketList();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function setSortButton(elmId, btnState) {
    $(`#${elmId} div svg:first-child`).attr('fill', btnState == SORT_DESCENDING ? SORTBTN_ARROW_COLOR_ACTIVE : SORTBTN_ARROW_COLOR_GRAYED);
    $(`#${elmId} div svg:last-child`).attr('fill', btnState == SORT_ASCENDING ? SORTBTN_ARROW_COLOR_ACTIVE : SORTBTN_ARROW_COLOR_GRAYED);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function loadSupportTickets() {
    // Show "loading" spinner
    $("#loader-spinner").css('display', "block");

    const data = {
        CourseInstanceId: GetFromQueryString("courseInstanceId"),
        Opened: true,
        Closed: true,
        Method: "GetList"
    };

    fetchFunction("TicketingSystem", data).then(d => {
        //console.log(d); // For debugging only!

        g_SupportTicketList = d.SupportTicketList;
        if (g_SupportTicketList == null) g_SupportTicketList = {};
        SortTickets();

        // Hide "loading" spinner
        $("#loader-spinner").css('display', "none");
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function UpperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function ShowSupportTicketList() {
    var html = "";

    if (g_SupportTicketList == null || g_SupportTicketList.length == undefined || g_SupportTicketList.length < 1) {
        $("#support-list-container").html(`
            <div class="support-list-item no-tickets">
                <i class="fa-regular fa-comment-dots"></i>&nbsp;No Support Ticket found!
            </div>
        `);
        return;
    }

    for (var i = 0; i < g_SupportTicketList.length; i++) {
        var ticketTokenNo = g_SupportTicketList[i].TokenNo;
        var ticketTitle = g_SupportTicketList[i].Title;
        var ticketStatus = UpperCaseFirst(g_SupportTicketList[i].Status);
        var ticketPriority = UpperCaseFirst(g_SupportTicketList[i].Priority);
        var ticketMsgList = g_SupportTicketList[i].MessageList;

        var clsPriority = (ticketPriority.toLowerCase() == "high") ? "high" : (ticketPriority.toLowerCase() == "medium" ? "medium" : "low");
        var clsStatus = (ticketStatus.toLowerCase() == "open") ? "open" : "closed";

        // Create ticket's messages DOM
        var msgHtml = "";
        for (var j = 0; j < ticketMsgList.length; j++) {
            var msgitemClass = "msg-item";
            var msgcontClass = "d-flex align-items-start";
            var msgusrimgClass = "person-image";
            var msgbubbClass = "speech-bubble";
            var msgImage = "";

            if (ticketMsgList[j].Role.toLowerCase() == "student") {
                msgitemClass += " align-items-start";
                msgcontClass += " flex-row";
                msgusrimgClass += " mr-3";
                msgbubbClass += " left";
            } else {
                msgitemClass += " align-items-end";
                msgcontClass += " flex-row-reverse";
                msgusrimgClass += " ml-3";
                msgbubbClass += " right";
            }

            if (ticketMsgList[j].ContentImage != undefined && ticketMsgList[j].ContentImage.length > ("data:image;base64,").length) {
                msgImage = `
                    <div class="image-view" style="max-height: 25rem;">
                        <img src="${ticketMsgList[j].ContentImage}" />
                    </div>
                `;
            }

            msgHtml += `
                <div class="${msgitemClass}">
                    <div class="msg-user-name">${ticketMsgList[j].PersonName}</div>
                    <div class="${msgcontClass}">
                        <div class="${msgusrimgClass}"><img src="${ticketMsgList[j].PersonImage.length ? ticketMsgList[j].PersonImage : 'Content/images/photo.jpg'}"/></div>
                        <div class="${msgbubbClass}">
                            ${msgImage}
                            ${ticketMsgList[j].Message}
                        </div>
                    </div>
                </div>
            `;
        }

        // Create a ticket footer ("Send a reply" button & "Close ticket" link)
        var footerHtml = "";
        if (g_SupportTicketList[i].Status.toLowerCase() == "open") {
            footerHtml = `
                <div class="d-flex align-items-center w-100 mt-4">
                    <div class="flex-grow-1" style="width: 33%;">
                        <a href="javascript:;" onclick="closeSupportTicket(${g_SupportTicketList[i].Id});">Close Ticket</a>
                    </div>
                    
                    <button type="button" class="button outline px-3" onclick="ticketReply(${g_SupportTicketList[i].Id});">Send Message</button>
                    
                    <div class="flex-grow-1" style="width: 33%;"></div>
                </div>
            `;
        }

        // Create ticket DOM
        html += `
            <div class="support-list-item">
                <div class="d-flex align-items-start justify-content-between">
                    <div class="d-flex flex-column">
                        <div class="ticket-tokenno">#${ticketTokenNo}</div>
                        <div class="ticket-title">${ticketTitle}</div>
                    </div>
                    <div class="d-flex">
                        <div class="ticket-prop ${clsPriority}" style="margin-right: 0.5rem;">${ticketPriority}</div>
                        <div class="ticket-prop ${clsStatus}">${ticketStatus}</div>
                    </div>
                </div>

                <div class="mt-3">${msgHtml}</div>
                ${footerHtml}
            </div>
        `;
    }

    $("#support-list-container").html(html);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function isValidFileType(elmInput) {
    if (elmInput.files == undefined || elmInput.files[0] == undefined) return false;

    const fileType = elmInput.files[0].type;
    var fileName = elmInput.files[0].name;
    var index = fileName.split(".").length - 1;
    var type2 = fileName.split(".")[index];

    return (fileType == "image/jpeg" || fileType == "image/png" || type2 == "jpg" || type2 == "png");
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function readAttachment(elmInput, imgElmContainerID, msgElmID) {
    msgHide(msgElmID);
    $(`#${imgElmContainerID}`).removeClass("d-block").addClass("d-none");
    $(`#${imgElmContainerID} img`).attr('src', "");

    if (!elmInput.files || !elmInput.files[0]) return false; // Leaving img.src = ""

    if (!isValidFileType(elmInput)) {
        msgShow(msgElmID, "error", "Sorry! The File type is not supported.");
        elmInput.value = null;
        return false;
    }

    var FR = new FileReader();
    FR.addEventListener("load", function (e) {
        var fileBase64String = e.target.result, substr = "base64,";
        var index = fileBase64String.indexOf(substr);
        if (index == -1) {
            msgShow(msgElmID, "error", "Sorry! The File is not supported.");
            elmInput.value = null;
            return false;
        }
        
        $(`#${imgElmContainerID} img`).attr('src', e.target.result);
        $(`#${imgElmContainerID}`).removeClass("d-none").addClass("d-block");
    });

    FR.readAsDataURL(elmInput.files[0]);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function submitSupportTicket() {
    var courseInstanceId = GetFromQueryString("courseInstanceId");
    var strSubject = $("#txtSubject").val().trim(), strMsgDetails = $("#txtMessage").val().trim();

    // Hide any success/failure messages from previous submission
    msgHide("msg-submission");

    // Validation
    if (!courseInstanceId || courseInstanceId == "")  return false;

    if (strSubject == "") {
        inputboxSetInvalid($("#txtSubject"), "Sorry! The Subject field cannot be left blank.");
        return false;
    }

    if (strMsgDetails == "") {
        inputboxSetInvalid($("#txtMessage"), "Sorry! The Request Details field cannot be left blank.");
        return false;
    }

    // Disable the page
    $("#disabled-div").css('display', "block");

    // Prepare data for the backend
    var imgBase64String = "", fileBase64String = $("#ImageView img").attr('src');

    if (fileBase64String != undefined && fileBase64String != "") {
        if (isValidFileType(document.getElementById("fileUploadImage"))) {
            var substr = "base64,";
            var index = fileBase64String.indexOf(substr);
            if (index == -1) {
                msgShow("msg-submission", "error", "Sorry! The File is not supported.");
                $("#disabled-div").css('display', "none"); // Re-enable the page
                return false;
            }
            imgBase64String = fileBase64String.substring(index + substr.length);
        } else {
            msgShow("msg-submission", "error", "Sorry! The File type is not supported.");
            $("#disabled-div").css('display', "none"); // Re-enable the page
            return false;
        }
    }

    const data = {
        CourseInstanceId: courseInstanceId,
        Title: strSubject,
        Message: strMsgDetails,
        Photo: imgBase64String,
        Priority: $("#ddPriority").val(),
        Opened: true,
        Closed: false,
        Method: "SaveNewTicket"
    };

    return fetchFunction("TicketingSystem", data).then(d => {
        msgShow("msg-submission", "success", "Your submission is successful!");

        // Clear the form
        $("#txtMessage").val("");
        $("#txtSubject").val("");
        $("#fileUploadImage").val("");
        $("#ddPriority").val("low");
        $("#ImageView img").attr('src', "");

        // Re-enable the page
        $("#disabled-div").css('display', "none");

        loadSupportTickets();
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function ticketReply(ticketID) {
    // When "Reply" button is clicked
    clearTicketFormErrorMsgs();

    // Define Swal's custom styles
    const styledSwal = Swal.mixin({
        buttonsStyling: false,
        customClass: {
            popup: 'swal-ticketreply-popup',
            title: 'swal-ticketreply-title',
            htmlContainer: 'swal-ticketreply-htmlcontainer',
            validationMessage: 'swal-ticketreply-invalidmsg',
            actions: 'swal-ticketreply-actions',
            confirmButton: 'button solid swal-ticketreply-button'
        }
    });

    styledSwal.fire({
        title: "Reply to a Support Ticket",
        html: `
            <div class="form-group col-12 mb-3 text-left">
                <label for="msgform-details" class="label mb-2">Your Message Details</label>
                <div class="textarea-container">
                    <textarea
                        class="textbox"
                        id="msgform-details"
                        rows="5"
                        placeholder="Your Message..."
                        onfocus="$(this).parent().addClass('active');"
                        onblur="$(this).parent().removeClass('active');"
                        oninput="this.parentElement.classList.remove('invalid'); msgHide('msg-reply');"
                    ></textarea>
                </div>
                <div style="width:95%;"><i class="fa-solid fa-circle-exclamation"></i>&nbsp;<span></span></div>
            </div>

            <div id="ticket-id" class="d-none" tid=${ticketID}></div>

            <div class="d-flex flex-row justify-content-center align-items-center">
                <div class="d-flex flex-column" style="width: 55%;">
                    <label class="label mb-2">Screenshot</label>
                    <label for="msgform-uploadimage" class="support-form-attachment-label">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.59163V13.3333C1 14.6594 1.52678 15.9311 2.46447 16.8688C3.40215 17.8065 4.67392 18.3333 6 18.3333C7.32608 18.3333 8.59785 17.8065 9.53553 16.8688C10.4732 15.9311 11 14.6594 11 13.3333V4.99996C11 4.1159 10.6488 3.26806 10.0237 2.64294C9.39857 2.01782 8.55072 1.66663 7.66667 1.66663C6.78261 1.66663 5.93477 2.01782 5.30964 2.64294C4.68452 3.26806 4.33333 4.1159 4.33333 4.99996V12.6516C4.33333 12.8705 4.37644 13.0872 4.4602 13.2894C4.54396 13.4916 4.66672 13.6754 4.82149 13.8301C4.97625 13.9849 5.15999 14.1077 5.36219 14.1914C5.5644 14.2752 5.78113 14.3183 6 14.3183V14.3183C6.44203 14.3183 6.86595 14.1427 7.17851 13.8301C7.49107 13.5176 7.66667 13.0937 7.66667 12.6516V6.66663" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        &nbsp;&nbsp;Attach jpg, png
                    </label>
                    <input type="file" id="msgform-uploadimage" class="d-none" accept=".png,.jpg" onchange="readAttachment(this, 'msgform-imgpreview', 'msg-reply');"/>
                </div>
                <div id="msgform-imgpreview" class="d-none" style="padding-left: 1rem"><img style="max-height: 4rem;" /></div>
            </div>

            <div style="width: 100%; min-height: 2.125rem;">
                <div class="msg" id="msg-reply" style="display: none;"></div>
            </div>
        `,
        confirmButtonText: 'Send Reply',
        showCloseButton: true,
        preConfirm: () => {
            return submitReplyMessage($("#ticket-id").attr('tid'));
        }
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function submitReplyMessage(ticketID) {
    var courseInstanceId = GetFromQueryString("courseInstanceId");
    var strMsgDetails = $("#msgform-details").val().trim();

    // Hide any success/failure messages from previous submission
    msgHide("msg-reply");

    // Validation
    if (!courseInstanceId || courseInstanceId == "")  return false;

    if (strMsgDetails == "") {
        inputboxSetInvalid($("#msgform-details"), "Your message cannot be empty.");
        return false; // Prevent closing the dialog
    }

    // Disable the page
    $("#disabled-div").css('display', "block");

    // Prepare data for the backend
    var imgBase64String = "", fileBase64String = $("#msgform-imgpreview img").attr('src');

    if (fileBase64String != undefined && fileBase64String != "") {
        if (isValidFileType(document.getElementById("msgform-uploadimage"))) {
            var substr = "base64,";
            var index = fileBase64String.indexOf(substr);
            if (index == -1) {
                msgShow("msg-reply", "error", "Sorry! The file is not supported.");
                $("#disabled-div").css('display', "none"); // Re-enable the page
                return false; // Prevent closing the dialog
            }
            imgBase64String = fileBase64String.substring(index + substr.length);
        } else {
            msgShow("msg-reply", "error", "Sorry! The file type is not supported.");
            $("#disabled-div").css('display', "none"); // Re-enable the page
            return false; // Prevent closing the dialog
        }
    }

    const data = {
        CourseInstanceId: GetFromQueryString("courseInstanceId"),
        SupportTicketId: ticketID,
        Message: strMsgDetails,
        Photo: imgBase64String,
        Method: "SaveMessage"
    };

    fetchFunction("TicketingSystem", data).then(d => {
        msgShow("msg-reply", "success", "Your submission is successful!");

        // Clear the form
        $("#msgform-details").val("");
        $("#msgform-uploadimage").val("");
        $("#msgform-imgpreview img").attr('src', "");

        // Re-enable the page
        $("#disabled-div").css('display', "none");

        loadSupportTickets();
    });

    // Let the promise resolves on its own. No problem.
    return true;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function closeSupportTicket(ticketID) {
    // When "Close Ticket" button is clicked
    clearTicketFormErrorMsgs();

    // First, confirm closing
    const styledSwal = Swal.mixin({
        buttonsStyling: false,
        customClass: {
            popup: 'swal-ticketreply-popup',
            htmlContainer: 'swal-ticketreply-htmlcontainer',
            actions: 'swal-ticketreply-actions',
            confirmButton: 'button solid swal-confirmclose-button',
            cancelButton: 'button outline swal-confirmclose-button'
        }
    });

    styledSwal.fire({
        text: 'Are you sure you want to close this Support Ticket?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Close Ticket',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Disable the page
            $("#disabled-div").css('display', "block");

            const data = {
                CourseInstanceId: GetFromQueryString("courseInstanceId"),
                SupportTicketId: ticketID,
                Method: "CloseTicket"
            };

            return fetchFunction("TicketingSystem", data).then(d => {
                // Re-enable the page
                $("#disabled-div").css('display', "none");

                // Re-load ticket. This will update Open/Closed ones.
                loadSupportTickets();
            });
        }
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function clearTicketFormErrorMsgs() {
    msgHide("msg-submission");
    $(".textbox").parent().removeClass('invalid');
}
