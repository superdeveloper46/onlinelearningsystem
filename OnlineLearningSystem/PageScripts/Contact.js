/*
"Contact" page
Revised by Humam Babi, 2022
*/

'use strict';

// Clear error message on input (also any validation error message will be cleared - see PageScripts/UserInterface.js)
$(".textbox").on('input', function () {
	msgHide("msg-submission");
});


///////////////////////////////////////////////////////////////////////////////////////////////////
function SendMessage() {
	var message = $("#TextBoxMessage").val().trim();

	if (validate(message)) {
		// Disable "Submit" button and show LoaderImage
		$("#loader-spinner").css('display', "block");
		$("#disabled-div").css('display', "block");

		const data = {
			Message: message
		};

		fetchFunction("Contact", data).then(d => {
			if (d.error != "") {
				msgShow("msg-submission", "error", d.error);
			} else
			if (d.success != "") {
				$("#TextBoxMessage").val("");
				msgShow("msg-submission", "success", d.success);
			}

			// Hide LoaderImage and re-enable the form
			$("#loader-spinner").css('display', "none");
			$("#disabled-div").css('display', "none");
		});
	}

	return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function validateMessageLength(message) {
	return (message.length > 400) ? false : true;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function validate(message) {
	var result = true;

	if (message == "") {
		result = false;
		inputboxSetInvalid($("#TextBoxMessage"), "Sorry! The Message field cannot be left blank");
	} else if (!validateMessageLength(message)) {
		result = false;
		inputboxSetInvalid($("#TextBoxMessage"), "Sorry! The message do not support more than 400 character.Total Character of your message is " + message.length + ".");
	}

	return result;
}
