using LMSLibrary;

namespace RESTModelFunctionsTest;

[TestClass]
public class CodeErrorsHintsController_Tests
{
    [TestMethod]
    public void GetCourses_ReturnsCourses()
    {
        CodeErrorsHintsController codeErrorsController = new CodeErrorsHintsController();
        var result = codeErrorsController.GetCourses();

        var okResult = result.Result as OkObjectResult;

        Assert.IsNotNull(okResult);
        Assert.AreEqual(200, okResult.StatusCode);

        var resultValue = okResult.Value as List<VmCourse>;
        Assert.IsTrue(resultValue?.Count > 0);
        
    }

    [TestMethod]
    public void GetErrorWithValidCourseId_ReturnsErrors()
    {
        var controller = new CodeErrorsHintsController();
        var response = controller.Get(new CodeErrorsHintsIncomingInfo { CourseId = 115 });

        var okResponse = response.Result as OkObjectResult;
        Assert.IsNotNull(okResponse);

        var responseValue = okResponse.Value as IEnumerable<SanitizedError>;
        Assert.IsNotNull(responseValue);
        Assert.IsTrue(responseValue.Count() > 0);
    }

    [TestMethod]
    public void GetHintsWithValidErrorId_ReturnsHints()
    {
        var controller = new CodeErrorsHintsController();
        var response = controller.GetHints(new CodeErrorsHintsIncomingInfo { ErrorId = 12 });

        var okResponse = response.Result as OkObjectResult;
        Assert.IsNotNull(okResponse);

        var responseValue = okResponse.Value as IEnumerable<CodeHint>;
        Assert.IsNotNull(responseValue);
        Assert.IsTrue(responseValue.Count() > 0);
    }

    [TestMethod]
    public void UpdateHintWithValidValues_ReturnsUpdatedHint()
    {
        Random random = new Random();
        string[] nameArray = { "Updated", "Hint", "For",  "Unit", "Testing" };
        var randomNameArray = nameArray.OrderBy(a => random.Next()).ToArray();
        var hint = String.Join(" ", randomNameArray);

        var controller = new CodeErrorsHintsController();
        var response = controller.UpdateHint(new CodeErrorsHintsIncomingInfo { HintId = 18, UpdatedHint = hint });

        var okResponse = response.Result as OkObjectResult;
        Assert.IsNotNull(okResponse);

        var responseValue = okResponse.Value as CodeHint;
        Assert.IsNotNull(responseValue);
        Assert.AreEqual(responseValue.Hint, hint);
        Assert.AreEqual(responseValue.Id, 18);
    }

    [TestMethod]
    public void InsertHintWithValidValues_ReturnsHint()
    {
        var hint = "Temporary hint for unit testing";

        var controller = new CodeErrorsHintsController();
        var response = controller.UpdateHint(new CodeErrorsHintsIncomingInfo { HintId = -1, UpdatedHint = hint, ErrorId = 12 });

        var okResponse = response.Result as OkObjectResult;
        Assert.IsNotNull(okResponse);

        var resultValue = okResponse.Value as CodeHint;
        Assert.IsTrue(resultValue.Id > 0);
        var deleteQuery = $@"DELETE FROM SanitizedCodeErrorCodeHint WHERE SanitizedCodeErrorId = {12} AND CodeHintId = {resultValue.Id} ";
        Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
        var updateQuery = $@"DELETE FROM CodeHint Where Hint = '{hint}'";
        Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(updateQuery) > 0);
    }

}
