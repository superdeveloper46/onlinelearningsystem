/*
Contact Us page
Revised by Humam Babi, 2022
*/

'use strict';

// Clear error message on input (also any validation error message will be cleared - see PageScripts/UserInterface.js)
$(".textbox").on('input', function () {
	msgHide("msg-submission");
});


///////////////////////////////////////////////////////////////////////////////////////////////////
function SendMessage() {
	var senderName = $("#TextBoxName").val().trim(), senderEmail = $("#TextBoxEmail").val().trim(), message = $("#TextBoxMessage").val().trim();

	if (validate(senderName, senderEmail, message)) {
		// Disable "Submit" button and show LoaderImage
		$("#login-loder-img").css('display', "block");
		$("#disabled-div").css('display', "block");

		const data = {
			SenderName: senderName,
			SenderEmail: senderEmail,
			Message: message
		};

		fetchFunction("ContactUs", data).then(d => {
			if (d.error != "") {
				msgShow("msg-submission", "error", d.error);
			} else
			if (d.success != "") {
				$("#TextBoxName").val("");
				$("#TextBoxEmail").val("");
				$("#TextBoxMessage").val("");

				msgShow("msg-submission", "success", d.success);
			}

			// Hide LoaderImage and re-enable the form
			$("#login-loder-img").css('display', "none");
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
function validateMessage(message) {
	const re = /^[a-zA-Z0-9?.,:! \n]*$/;
	return re.test(message);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function validateName(name) {
	const re = /^[a-zA-Z0-9_ .,-]*$/;
	return re.test(name);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function validate(senderName, senderEmail, message) {
	var result = true;

	if (senderName == "") {
		result = false;
		inputboxSetInvalid($("#TextBoxName"), "This field can't be empty");
	} else if (!validateName(senderName)) {
		result = false;
		inputboxSetInvalid($("#TextBoxName"), "Invalid Full Name");
	}

	if (senderEmail == "") {
		result = false;
		inputboxSetInvalid($("#TextBoxEmail"), "This field can't be empty");
	} else if (!validateEmail(senderEmail)) {
		result = false;
		inputboxSetInvalid($("#TextBoxEmail"), "Invalid Email Address");
	}
	
	if (message == "") {
		result = false;
		inputboxSetInvalid($("#TextBoxMessage"), "Invalid Message");
	} else if (!validateMessage(message) || !validateMessageLength(message)) {
		result = false;
		inputboxSetInvalid($("#TextBoxMessage"), "Invalid Message");
	}

	return result;
}
