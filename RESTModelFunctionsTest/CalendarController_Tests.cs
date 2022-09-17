namespace RESTModelFunctionsTest;

[TestClass]
public class CalendarController_Tests
{
    [TestMethod]
    [ExpectedException(typeof(NullReferenceException))]
    public void CalendarInfoWithInvalidStudentHash_ReturnsException()
    {
        CalendarController calendarController = new CalendarController();
        var calendarIncomingInfo = new CalendarIncomingInfo { StudentHash = "invalidstudenthash" };
        var result = calendarController.Post(calendarIncomingInfo);
    }

    [TestMethod]
    public void CalendarInfoWithValidStudentHash_ReturnsOkResponse()
    {
        CalendarController calendarController = new CalendarController();
        var calendarIncomingInfo = new CalendarIncomingInfo { StudentHash = "bce20431-5af2-4837-812f-5a2c5b65ce53" };
        var result = calendarController.Post(calendarIncomingInfo);
        var okResult = result.Result as OkObjectResult;

        Assert.IsNotNull(okResult);
        Assert.AreEqual(200, okResult.StatusCode);

        var resultValue = okResult.Value as CalendarResultInfo;
        Assert.IsNotNull(resultValue);
        Assert.AreEqual(resultValue.StartDate.ToShortDateString(), DateTime.Parse("6/20/2022").ToShortDateString());
        Assert.AreEqual(resultValue.EndDate.ToShortDateString(), DateTime.Parse("1/1/2050").ToShortDateString());
        Assert.AreEqual(resultValue.ActivityTypes.Count, 2);
        Assert.AreEqual(resultValue.Courses.Count, 1);
        Assert.AreEqual(resultValue.Dates.Length, 10057);
        Assert.IsTrue(resultValue.Dates.Any(a => a?.Activities.Count > 0));
        var duedate = resultValue.Dates[2964].DueDate;
        Assert.AreEqual(Convert.ToDateTime(duedate), Convert.ToDateTime("8/1/2030 11:59:59 PM"));
        var activity = resultValue.Dates[2964].Activities[0];
        Assert.AreEqual(activity.CourseName, "courseforunittest");
        Assert.AreEqual(activity.CourseInstanceId, 116);
        Assert.AreEqual(activity.CourseName, "courseforunittest");
        Assert.AreEqual(activity.Title, "Coding problem for unit testing with variables");
        Assert.AreEqual(activity.Type, "Assessment");
        Assert.AreEqual(activity.Id, 349);
        Assert.AreEqual(activity.ModuleObjectiveId, 498);
    }

    [TestMethod]
    public void CalendarInfoOfCourseWithZeroDayQuarter_ReturnsStartAndEndDateOnly()
    {
        CalendarController calendarController = new CalendarController();
        var calendarIncomingInfo = new CalendarIncomingInfo { StudentHash = "56639f07-c41c-4580-b717-375872278323" };
        var result = calendarController.Post(calendarIncomingInfo);
        var okResult = result.Result as OkObjectResult;

        Assert.IsNotNull(okResult);
        Assert.AreEqual(200, okResult.StatusCode);

        var resultValue = okResult.Value as CalendarResultInfo;
        Assert.IsNotNull(resultValue);
        Assert.AreEqual(resultValue.StartDate.ToShortDateString(), "7/1/2022");
        Assert.AreEqual(resultValue.EndDate.ToShortDateString(), "7/1/2022");
        Assert.IsNull(resultValue.Courses);
        Assert.IsNull(resultValue.ActivityTypes);
        Assert.IsNull(resultValue.Dates);
    }


}

