/*
Interaction (Code Assignment)
*/

'use strict';

// Global constants
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Global variables
var g_Today = new Date(), g_StartDate = g_Today, g_EndDate = g_Today;
var g_Dates = [], g_Courses = [], g_ActivityTypes = [], g_ChosenCourses = [];
var g_CurYear = g_Today.getFullYear(), g_CurMonth = g_Today.getMonth(), g_CurDay = g_Today.getDate();
var g_bOnlyUncompleted = true, g_PopperInstances = [], g_PopupTimerId = 0;


// When the page is loaded and ready
$(document).ready(function () {
	getCalendar();
});


///////////////////////////////////////////////////////////////////////////////////////////////////
function getCalendar() {
	const data = {
		CourseInstanceId: GetFromQueryString("courseInstanceId")
	};

	fetchFunction("Calendar", data).then(d => {
		//console.log(d); // For debugging only!
		
		var sd = new Date(Date.parse(d.StartDate)), ed = new Date(Date.parse(d.EndDate));

		g_StartDate = new Date(sd.getFullYear(), sd.getMonth());
		g_EndDate = new Date(ed.getFullYear(), ed.getMonth());
		g_Dates = d.Dates;
		g_Courses = d.Courses;
		g_ActivityTypes = d.ActivityTypes;

		createCourseFilter();
		ShowCalendar();

		// Hide the loading spinner
		$("#loader-spinner").css('display', "none");
	});
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function createCourseFilter() {
	var courseFilter = GetFromQueryString("courseInstanceId");
	
	if (g_Courses) {
		for (let i = 0; i < g_Courses.length; i++) {
			if (g_Courses[i].CourseInstanceId == courseFilter) {
				g_ChosenCourses.push({ CourseInstanceId: g_Courses[i].CourseInstanceId, CourseName: g_Courses[i].CourseName });
			}
		}

		if (g_ChosenCourses.length == 0) g_ChosenCourses = g_Courses.slice(0);
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function checkCompletion() {
	g_bOnlyUncompleted = !g_bOnlyUncompleted;
	ShowCalendar();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function addTasks(iDayDate, Activities, DueDate, objTasksPopups) {
	var tasksHTML = "", popupsHTML = "";

	for (var i in Activities) {
		var oneActivity = Activities[i];

		if (g_bOnlyUncompleted && (oneActivity.Completion >= 100)) continue;
		if (!courseChecked(oneActivity.CourseInstanceId)) continue;
		if (!typeChecked(oneActivity.Type)) continue;

		var bCompleted = (oneActivity.Completion >= 100) ? true : false;
		var goUrl = '', taskItemId = oneActivity.Id, taskItemType = oneActivity.Type;

		if (taskItemType == 'Material') goUrl = GetUrl('Material.html', 'materialId', taskItemId);
		else if (taskItemType == 'Quiz') goUrl = GetUrl('QuizPage.html', 'questionSetId', taskItemId);
		else if (taskItemType == 'Assessment') goUrl = GetUrl('Interaction.html', 'codingProblemId', taskItemId);
		else if (taskItemType == 'Poll') goUrl = GetUrl('PollResponse.html', 'pollGroupId', taskItemId, "moduleObjectiveId", oneActivity.ModuleObjectiveId);
		else if (taskItemType == 'Discussion') goUrl = GetUrl('DiscussionBoardPage.html', 'discussionBoardId', taskItemId, "moduleObjectiveId", oneActivity.ModuleObjectiveId);
		else  throw 'Activity Not Supported: ' + taskItemType;

		var taskClassList = "task" + (bCompleted ? " completed" : "");
		var taskText = oneActivity.Title;
		//if (taskText.length > 6) taskText = oneActivity.Title.substring(0, 6) + "...";
		taskText += " - " + (bCompleted ? "Completed" : "Pending");
		
		tasksHTML += `
			<div
			class="${taskClassList}"
			id="task_${iDayDate}_${taskItemId}_${taskItemType}"
			aria-describedby="popup_${iDayDate}_${taskItemId}_${taskItemType}"
			onmouseenter="taskpopupShow(${g_PopperInstances.length}, ${iDayDate}, ${taskItemId}, '${taskItemType}')"
			onfocus="taskpopupShow(${g_PopperInstances.length}, ${iDayDate}, ${taskItemId}, '${taskItemType}')"
			onmouseleave="taskpopupHide(${iDayDate}, ${taskItemId}, '${taskItemType}')"
			onblur="taskpopupHide(${iDayDate}, ${taskItemId}, '${taskItemType}')"
			>
				<i class="fa-solid fa-circle"></i>&nbsp;
				<span>${taskText}</span>
			</div>
		`;

		popupsHTML += `
			<div
			class="taskpopup"
			id="popup_${iDayDate}_${taskItemId}_${taskItemType}"
			role="tooltip"
			onmouseover="taskpopupCancelHide()"
			onmouseleave="taskpopupHide(${iDayDate}, ${taskItemId}, '${taskItemType}')"
			>
				<div class="row">
					<div class="col-md">
						<span>${oneActivity.Type}</span><br/>
					</div>
					<div class="col-md text-right">
						<a href="${goUrl}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i>&nbsp;Open</a>
					</div>
				</div>
				<br/>
				<span><strong>${oneActivity.Title}</strong></span><br/>
				<br/>
				<div class="row">
					<div class="col-md">
						<span>Due:&nbsp;${DueDate}</span>
					</div>
					<div class="col-md text-right">
						<span>${oneActivity.Completion}%<br/> COMPLETED</span>
					</div>
				</div>
				<div class="popup_arrow" data-popper-arrow></div>
			</div>
		`;

		g_PopperInstances.push({iDayDate: iDayDate, taskId: taskItemId, taskType: taskItemType, popperInstance: null});
	}

	objTasksPopups.tasksHTML += tasksHTML;
	objTasksPopups.popupsHTML += popupsHTML;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function ShowCalendar() {
	var firstDay = new Date(g_CurYear, g_CurMonth).getDay(); // First day of the month (day of the week)
	var daysInMonth = 32 - new Date(g_CurYear, g_CurMonth, 32).getDate();
	var tblHTML = "", popupsHTML = "", iDayDate = 1;

	// Set current month on the calendar header
	$("#calctl-curmonthyear-label").text(MONTHS[g_CurMonth] + " " +  g_CurYear);

	// Clear old Popper instances
	g_PopperInstances = [];
	
	//console.log(g_Dates); // For debugging only!

	// Create table cells DOM tree
	for (let iRow = 0; iRow < 6; iRow++) {
		var rowHTML = "<tr>";

		for (let iDay = 0; iDay < 7; iDay++) {
			const bToday = (g_CurMonth == g_Today.getMonth() && g_CurYear == g_Today.getFullYear() && g_CurDay == iDayDate) ? true : false;
			const bDayNotOfThisMonth = ((iRow == 0 && iDay < firstDay) || (iDayDate > daysInMonth)) ? true : false;

			var cellBackgroundColor = "#FFF";
			if (bToday) cellBackgroundColor = "#EEFAFD";
			if (bDayNotOfThisMonth) cellBackgroundColor = "#F9F9F9";
			
			var objTasksPopups = { tasksHTML: "", popupsHTML: "" };
			if (!bDayNotOfThisMonth && g_Dates) {
				for (var taskDate of g_Dates) {
					if (taskDate != null) {
						var taskDateDue = new Date(taskDate.DueDate);
						if (taskDateDue.getFullYear() == g_CurYear && taskDateDue.getMonth() == g_CurMonth && taskDateDue.getDate() == iDayDate) {
							addTasks(iDayDate, taskDate.Activities, taskDate.DueDate, objTasksPopups);
						}
					}
				}
			}

			var cellHTML = `
				<td class="cell" style="background-color: ${cellBackgroundColor}">					<!-- var cell -->
					<div class="day-of-week${bToday ? " today" : ""}">								<!-- var divDayOfWeek -->
						${bDayNotOfThisMonth ? "" : WEEKDAYS[iDay]}
					</div>
					
					<div class="day-number${bToday ? " today" : ""}">								<!-- var divDayNumber -->
						${bDayNotOfThisMonth ? "" : iDayDate}
					</div>

					<div class="tasks-container">
						${objTasksPopups.tasksHTML}
					</div>
				</td>
			`;

			popupsHTML += objTasksPopups.popupsHTML;
			rowHTML += cellHTML;

			if (iRow == 0 && iDay < firstDay) continue; // Previous month -> don't advance iDay!
			iDayDate++;
		}

		rowHTML += "</tr>";
		tblHTML += rowHTML;

		if (iDayDate > daysInMonth) break; // No need to completely show 6 rows if the month is over
	}

	$("#calendar-body").html(tblHTML);
	$("#popups-container").html(popupsHTML);

	// After adding elements to the document's DOM
	for (var i = 0; i < g_PopperInstances.length; i++) {
		const oneElm = g_PopperInstances[i];
		const popperInstance = Popper.createPopper(
			document.getElementById(`task_${oneElm.iDayDate}_${oneElm.taskId}_${oneElm.taskType}`),
			document.getElementById(`popup_${oneElm.iDayDate}_${oneElm.taskId}_${oneElm.taskType}`),
			{
				modifiers: [{
					name: 'offset',
					options: { offset: [0, 8] }
				}]
			}
		);
		g_PopperInstances[i].popperInstance = popperInstance;
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function taskpopupShow(iPopperInstanceIndex, iDayDate, taskId, taskType) {
	document.getElementById(`popup_${iDayDate}_${taskId}_${taskType}`).setAttribute('data-show', '');
	g_PopperInstances[iPopperInstanceIndex].popperInstance.update();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function taskpopupHide(iDayDate, taskId, taskType) {
	g_PopupTimerId = setTimeout(() => {
		document.getElementById(`popup_${iDayDate}_${taskId}_${taskType}`).removeAttribute('data-show');
	}, 150);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function taskpopupCancelHide() {
	if (g_PopupTimerId) clearTimeout(g_PopupTimerId);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function courseChecked(id) {
	for (let i = 0; i < g_ChosenCourses.length; i++) {
		if (g_ChosenCourses[i].CourseInstanceId == id) return true;
	}

	return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function typeChecked(type) {
	for (let i = 0; i < g_ActivityTypes.length; i++) {
		if (g_ActivityTypes[i] == type) return true;
	}

	return false;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function calctlPrevious() {
	var newCurrentYear = (g_CurMonth === 0) ? g_CurYear - 1 : g_CurYear;
	var newCurrentMonth = (g_CurMonth === 0) ? 11 : g_CurMonth - 1;
	var newDate = new Date(newCurrentYear, newCurrentMonth);

	if (newDate >= g_StartDate) {
		g_CurYear = newCurrentYear;
		g_CurMonth = newCurrentMonth;
		ShowCalendar();
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function calctlNext() {
	var newCurrentYear = (g_CurMonth === 11) ? g_CurYear + 1 : g_CurYear;
	var newCurrentMonth = (g_CurMonth === 11) ? 0 : g_CurMonth + 1;
	var newDate = new Date(newCurrentYear, newCurrentMonth);

	if (newDate <= g_EndDate) {
		g_CurYear = newCurrentYear;
		g_CurMonth = newCurrentMonth;
		ShowCalendar();
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////////
function calctlToday() {
	$("#today").blur();
	g_CurYear = g_Today.getFullYear();
	g_CurMonth = g_Today.getMonth();
	ShowCalendar();
}
