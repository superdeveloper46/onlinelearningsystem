/*
User Interface functions
*/

'use strict';

/*
Input box
*/

// Set (and remove) active border
$("input.textbox, textarea.textbox").on('focus', function () {
    $(this).parent().addClass("active");
});
$("input.textbox, textarea.textbox").on('blur', function () {
    $(this).parent().removeClass("active");
});

// Handle pressing the 'eye' icon of a password input box
$(".pw-vis").click(function () {
    var elmContainer = this.parentElement, elmEyeDiv = this, elmInput = elmContainer.getElementsByTagName("input")[0];

    if (elmEyeDiv.classList.contains("hidden")) {
        elmEyeDiv.classList.remove("hidden");
        elmEyeDiv.classList.add("revealed");
        elmInput.type = "text";
    } else {
        elmEyeDiv.classList.remove("revealed");
        elmEyeDiv.classList.add("hidden");
        elmInput.type = "password";
    }
});

// Set an input box as invalid
function inputboxSetInvalid(jqelmInput, strErrMsg) {
    var elmInputContainer = jqelmInput.parent();
    var elmErrorMessage = elmInputContainer.next().children('span');

    elmErrorMessage.text(strErrMsg);
    elmInputContainer.addClass("invalid");
}

// Remove invalid flag from inputboxes on input
$("input.textbox, textarea.textbox").on('input', function () {
    this.parentElement.classList.remove('invalid');
});


/*
Message alerts
*/

// Show a message alert
function msgShow(strElmId, strMsgClass, strHtmlText) {
    var jqElm = $("#" + strElmId), htmlIcon;

    if (strMsgClass == "error") {
        htmlIcon = '<i class="fa-solid fa-circle-exclamation"></i>';
        jqElm.removeClass("success");
    }
    if (strMsgClass == "success") {
        htmlIcon = '<i class="fa-solid fa-circle-check"></i>';
        jqElm.removeClass("error");
    }

    jqElm.html(htmlIcon + '&nbsp;' + strHtmlText);
    jqElm.addClass(strMsgClass);

    jqElm.fadeIn();
}

// Hide a message manually (not using the x button)
function msgHide(strElmId) {
    $("#" + strElmId).fadeOut();
}


/*
Editables
(After loading the DOM)
*/
var g_bEditablesInitialized = false;
function InitializeEditables() {
    // Prepare the DOM
    if ($('.editable-container[editable-type=richText]').length > 0 && !g_bEditablesInitialized) {
        var style = document.createElement('link');
        style.href = "Content/summernote-0.8.18/summernote-lite.css";
        style.rel = "stylesheet";
        document.getElementsByTagName('head')[0].append(style);

        var script = document.createElement('script');
        script.src = "Content/summernote-0.8.18/summernote-lite.js";
        document.getElementsByTagName('body')[0].append(script);

        g_bEditablesInitialized = true;
    }

    // Prepare each editable field
    $('.editable-container').each((index, elm) => {
        const idEditable = $(elm).attr('editable-id');
        const elmEditable = $(elm).children(`#${idEditable}`);
        const apiEditable = $(elm).attr('editable-api');
        const apiEndpoint = apiEditable.substr(0, apiEditable.indexOf('.'));
        const apiMethod = apiEditable.substr(apiEditable.indexOf('.') + 1, apiEditable.indexOf('[') - apiEditable.indexOf('.') - 1);
        const apiAssocInfo = apiEditable.substr(apiEditable.indexOf('[') + 1, (apiEditable.length - 1) - apiEditable.indexOf('[') - 1);
        const typeEditable = $(elm).attr('editable-type');

        // For each editable field, the field's content must be saved in sessionStorage
        // with {id: content} JSON structure, *After* AJAX call returns with data.

        const elmBtnEdit = $(elm).children('.editable-btn-edit');
        const elmBtnSave = $(elm).children('.editable-btn-save');
        const elmBtnCancel = $(elm).children('.editable-btn-cancel');

        elmBtnEdit.css('display', localStorage.getItem('IsAdmin') == 'true' ? "flex" : "none");
        elmBtnEdit.click(() => {
            if (typeEditable == "richText") {
                $(elm).addClass("beingedited"); // Special style while editing (if defined)

                $(`#${idEditable}`).summernote({
                    height: 253, minHeight: 253, maxHeight: 253,
                    focus: true,
                    toolbar: [
                        ['paragraph', ['style']],
                        ['fontstyle', ['bold', 'italic', 'underline', 'strikethrough']],
                        ['script', ['superscript', 'subscript']],
                        ['clear', ['clear']],
                        ['history', ['undo', 'redo']],
                        ['color', ['forecolor']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['misc', ['codeview']]
                    ]
                });
            } else if (typeEditable == "dateTime") {
                elmEditable.prop('editable-saved-display', elmEditable.css('display'));
                elmEditable.css('display', "none");

                $(`<input type="datetime-local" class="beingedited" value="${elmEditable.text()}" orig-id="${idEditable}" />`)
                .insertAfter(`#${idEditable}`);
            } else if (typeEditable == "simpleText") {
                elmEditable.attr('contentEditable', true);
            } else if (typeEditable == "code") {
                var editor = ace.edit(idEditable);
    
                // Save user-typed code, and replace it by the "Script" component
                sessionStorage.setItem('editablecode' + idEditable, editor.getSession().getValue());
                editor.getSession().setValue(sessionStorage.getItem(idEditable));
            }

            elmBtnEdit.css('display', "none");
            elmBtnSave.css('display', "flex");
            elmBtnCancel.css('display', "flex");

            elmBtnSave.click(() => {
                var fieldData = "";
                
                $("#loader-spinner").css('display', "block");

                if (typeEditable == "richText") {
                    fieldData = $(`#${idEditable}`).summernote('code');
                    if (fieldData.trim() == '') {
                        // Continue as a "discard"
                        $("#loader-spinner").css('display', "none");
                        elmBtnCancel.css('display', "none");
                        elmBtnSave.css('display', "none");
                        elmBtnEdit.css('display', "flex");
                        $(`#${idEditable}`).summernote('destroy');
                        $(elm).removeClass("beingedited");
                        elmEditable.html(sessionStorage.getItem(idEditable));
                        return;
                    }
                } else if (typeEditable == "dateTime") {
                    fieldData = $(`input[orig-id=${idEditable}]`).val();
                    if (fieldData.trim() == '') {
                        // Continue as a "discard"
                        $("#loader-spinner").css('display', "none");
                        elmBtnCancel.css('display', "none");
                        elmBtnSave.css('display', "none");
                        elmBtnEdit.css('display', "flex");
                        $(`input[orig-id=${idEditable}]`).remove();
                        elmEditable.css('display', elmEditable.prop('editable-saved-display'));
                        elmEditable.text(sessionStorage.getItem(idEditable));
                        return;
                    }
                } else if (typeEditable == "simpleText") {
                    fieldData = $(`#${idEditable}`).text();
                    if (fieldData.trim() == '') {
                        // Continue as a "discard"
                        $("#loader-spinner").css('display', "none");
                        elmBtnCancel.css('display', "none");
                        elmBtnSave.css('display', "none");
                        elmBtnEdit.css('display', "flex");
                        elmEditable.attr('contentEditable', false);
                        elmEditable.text(sessionStorage.getItem(idEditable));
                        return;
                    }
                } else if (typeEditable == "code") {
                    var editor = ace.edit(idEditable);
                    fieldData = editor.getSession().getValue();
                    if (fieldData.trim() == '') {
                        // Continue as a "discard"
                        $("#loader-spinner").css('display', "none");
                        elmBtnCancel.css('display', "none");
                        elmBtnSave.css('display', "none");
                        elmBtnEdit.css('display', "flex");
                        editor.getSession().setValue(sessionStorage.getItem('editablecode' + idEditable)); // Restore user-typed code
                        return;
                    }
                }

                var data = { Method: apiMethod, FieldData: fieldData };

                // Add field's associated data
                var arrayAssocInfo = apiAssocInfo.split(",");
                for (var idx in arrayAssocInfo) {
                    data[arrayAssocInfo[idx]] = GetFromQueryString(arrayAssocInfo[idx]);
                }

                fetchAdmin(apiEndpoint, data).then(d => {
                    //console.log(d); // For debugging only!
                    $("#loader-spinner").css('display', "none");

                    if (d.Code == 1) {
                        elmBtnCancel.css('display', "none");
                        elmBtnSave.css('display', "none");
                        elmBtnEdit.css('display', "flex");

                        // As a "discard", but without resetting contents, and set the session variables to the new values
                        if (typeEditable == "richText") {
                            $(`#${idEditable}`).summernote('destroy');
                            $(elm).removeClass("beingedited"); // Remove the special style (if defined)
                            elmEditable.html(fieldData);
                        } else if (typeEditable == "dateTime") {
                            $(`input[orig-id=${idEditable}]`).remove();
                            elmEditable.css('display', elmEditable.prop('editable-saved-display'));
                            elmEditable.text(fieldData);
                        } else if (typeEditable == "simpleText") {
                            elmEditable.attr('contentEditable', false);
                            elmEditable.text(fieldData);
                        } else if (typeEditable == "code") {
                            var editor = ace.edit(idEditable);
                            editor.getSession().setValue(sessionStorage.getItem('editablecode' + idEditable)); // Restore user-typed code
                        }

                        sessionStorage.setItem(idEditable, fieldData);
                    }
                    if (d.Code == -1) {
                        AlertMessage("error", "Error occurred!");
                    }
                    if (d.Code == 0) {
                        AlertMessage("warning", d.Message);
                    }
                });
            });

            elmBtnCancel.click(() => {
                if (typeEditable == "richText") {
                    $(`#${idEditable}`).summernote('destroy');
                    $(elm).removeClass("beingedited"); // Remove the special style (if defined)
                    elmEditable.html(sessionStorage.getItem(idEditable)); // Reset contents to original
                } else if (typeEditable == "dateTime") {
                    $(`input[orig-id=${idEditable}]`).remove();
                    elmEditable.css('display', elmEditable.prop('editable-saved-display'));
                    elmEditable.text(sessionStorage.getItem(idEditable)); // Reset contents to original
                } else if (typeEditable == "simpleText") {
                    elmEditable.attr('contentEditable', false);
                    elmEditable.text(sessionStorage.getItem(idEditable)); // Reset contents to original
                } else if (typeEditable == "code") {
                    var editor = ace.edit(idEditable);
                    editor.getSession().setValue(sessionStorage.getItem('editablecode' + idEditable)); // Restore user-typed code
                }

                elmBtnCancel.css('display', "none");
                elmBtnSave.css('display', "none");
                elmBtnEdit.css('display', "flex");
            });

            elmEditable.focus();
        });
    });

    // Prepare each and every admin buttons ///////////////////////////////////////////////////////
    $('.adminctrl-container').each((index, elm) => {
        const elmBtnAdd = $(elm).children('.editable-btn-add');
        const elmBtnEdit = $(elm).children('.editable-btn-edit');
        const elmBtnDelete = $(elm).children('.editable-btn-delete');
        const elmBtnSave = $(elm).children('.editable-btn-save');
        const elmBtnCancel = $(elm).children('.editable-btn-cancel');
        
        elmBtnAdd.css('display', localStorage.getItem('IsAdmin') == 'true' ? "flex" : "none");
        elmBtnEdit.css('display', localStorage.getItem('IsAdmin') == 'true' ? "flex" : "none");
        elmBtnDelete.css('display', localStorage.getItem('IsAdmin') == 'true' ? "flex" : "none");

        elmBtnEdit.click(() => {
            const jsonEditables = JSON.parse($(elm).attr('editable-info'));
            var firstEditable = null;

            //console.log(jsonEditables);

            for (var i = 0; i < jsonEditables.length; i++) {
                if (jsonEditables[i].type == "simpleText") {
                    // simpleText
                    const elmEditable = $(`#${jsonEditables[i].id}`);
                    elmEditable.addClass("admin-editable");
                    elmEditable.attr('contentEditable', true);
                    if (firstEditable == null) firstEditable = elmEditable;
                } else if (jsonEditables[i].type == "replaceBySimpleText") {
                    // replaceBySimpleText
                    var elmNew = $(`<span id="${jsonEditables[i].id}replacement" class="admin-editable" contentEditable="true"></span>`);
                    if (jsonEditables[i].class != null) elmNew.addClass(jsonEditables[i].class);
                    elmNew.attr('contentEditable', true);
                    elmNew.text(sessionStorage.getItem(jsonEditables[i].src));
                    elmNew.insertAfter(`#${jsonEditables[i].id}`);
                    $(`#${jsonEditables[i].id}`).prop('editable-saved-display', $(`#${jsonEditables[i].id}`).css('display'));
                    $(`#${jsonEditables[i].id}`).css('display', "none");
                    if (firstEditable == null) firstEditable = elmNew;
                }
            }

            elmBtnEdit.css('display', "none");
            elmBtnDelete.css('display', "none");
            elmBtnSave.css('display', "flex");
            elmBtnCancel.css('display', "flex");

            elmBtnSave.click(() => {
                const apiEditable = $(elm).attr('editable-api');
                const apiEndpoint = apiEditable.substr(0, apiEditable.indexOf('.'));
                const apiMethod = apiEditable.substr(apiEditable.indexOf('.') + 1);
                const arrayApiAssocData = $(elm).attr('editable-assocdata').split(",");
                var fieldData = [];
                
                $("#loader-spinner").css('display', "block");

                for (var i = 0; i < jsonEditables.length; i++) {
                    if (jsonEditables[i].type == "simpleText") {
                        const elmEditable = $(`#${jsonEditables[i].id}`);
                        var field = {};

                        field['Name'] = jsonEditables[i].dataname;
                        field['Value'] = elmEditable.text();
                        if (field['Value'].trim() == '') {
                            // Continue as a "cancel"
                            $("#loader-spinner").css('display', "none");
                            elmBtnCancel.css('display', "none");
                            elmBtnSave.css('display', "none");
                            elmBtnEdit.css('display', "flex");
                            elmBtnDelete.css('display', "flex");
                            elmEditable.removeClass("admin-editable");
                            elmEditable.attr('contentEditable', false);
                            elmEditable.text(sessionStorage.getItem(jsonEditables[i].id)); // Reset contents to original
                            return;
                        }
                        fieldData.push(field);
                    } else if (jsonEditables[i].type == "replaceBySimpleText") {
                        const elmNew = $(`#${jsonEditables[i].id}replacement`);
                        var field = {};
                        
                        field['Name'] = jsonEditables[i].dataname;
                        field['Value'] = elmNew.text();
                        if (field['Value'].trim() == '') {
                            // Continue as a "cancel"
                            $("#loader-spinner").css('display', "none");
                            elmBtnCancel.css('display', "none");
                            elmBtnSave.css('display', "none");
                            elmBtnEdit.css('display', "flex");
                            elmBtnDelete.css('display', "flex");
                            elmNew.remove();
                            $(`#${jsonEditables[i].id}`).css('display', $(`#${jsonEditables[i].id}`).prop('editable-saved-display'));
                            return;
                        }
                        fieldData.push(field);
                    }
                }

                var data = { Method: apiMethod, FieldData: fieldData };

                // Add field's associated data
                for (var idx in arrayApiAssocData) {
                    var adName = (arrayApiAssocData[idx]).substr(0, (arrayApiAssocData[idx]).indexOf('='));
                    var adVal = (arrayApiAssocData[idx]).substr((arrayApiAssocData[idx]).indexOf('=') + 1);
                    data[adName] = adVal;
                }

                console.log(data);

                fetchAdmin(apiEndpoint, data).then(d => {
                    console.log(d); // For debugging only!
                    $("#loader-spinner").css('display', "none");

                    if (d.Code == 1) {
                        elmBtnCancel.css('display', "none");
                        elmBtnSave.css('display', "none");
                        elmBtnEdit.css('display', "flex");
                        elmBtnDelete.css('display', "flex");
        
                        // As a "cancel", but without resetting contents, and set the session variables to the new values
                        for (var i = 0; i < jsonEditables.length; i++) {
                            if (jsonEditables[i].type == "simpleText") {
                                // simpleText
                                const elmEditable = $(`#${jsonEditables[i].id}`);
                                elmEditable.removeClass("admin-editable");
                                elmEditable.attr('contentEditable', false);
                                elmEditable.text(fieldData[i]['Value']); // Array elements here are in the same order as when they were saved above
                            } else if (jsonEditables[i].type == "replaceBySimpleText") {
                                // replaceBySimpleText
                                var elmNew = $(`#${jsonEditables[i].id}replacement`);
                                elmNew.remove();
                                $(`#${jsonEditables[i].id}`).css('display', $(`#${jsonEditables[i].id}`).prop('editable-saved-display'));
                            }

                            sessionStorage.setItem(jsonEditables[i].id, fieldData[i]['Value']);
                        }
                    }
                    if (d.Code == -1) {
                        AlertMessage("error", "Error occurred!");
                    }
                    if (d.Code == 0) {
                        AlertMessage("warning", d.Message);
                    }
                });
            });
            elmBtnCancel.click(() => {
                for (var i = 0; i < jsonEditables.length; i++) {
                    if (jsonEditables[i].type == "simpleText") {
                        // simpleText
                        const elmEditable = $(`#${jsonEditables[i].id}`);
                        elmEditable.removeClass("admin-editable");
                        elmEditable.attr('contentEditable', false);
                        elmEditable.text(sessionStorage.getItem(jsonEditables[i].id)); // Reset contents to original
                    } else if (jsonEditables[i].type == "replaceBySimpleText") {
                        // replaceBySimpleText
                        var elmNew = $(`#${jsonEditables[i].id}replacement`);
                        elmNew.remove();
                        $(`#${jsonEditables[i].id}`).css('display', $(`#${jsonEditables[i].id}`).prop('editable-saved-display'));
                    }
                }

                elmBtnCancel.css('display', "none");
                elmBtnSave.css('display', "none");
                elmBtnEdit.css('display', "flex");
                elmBtnDelete.css('display', "flex");
            });

            if (firstEditable != null) firstEditable.focus();
        });

    });
} // InitializeEditables()

function AlertMessage(icon, message) {
    const styledSwal = Swal.mixin({
        buttonsStyling: false,
        customClass: {
            popup: 'swal-general-popup',
            htmlContainer: 'swal-general-htmlcontainer',
            actions: 'swal-general-actions',
            confirmButton: 'button solid swal-general-button'
        }
    });

    return styledSwal.fire({text: message, icon: icon});
}

$(document).ready(() => {
    InitializeEditables(); // Call this function after receiving ajax response.
});
