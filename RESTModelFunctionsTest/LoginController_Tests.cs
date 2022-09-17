using LMSLibrary;

namespace RESTModelFunctionsTest;

[TestClass]
public class LoginController_Tests
{

    [TestMethod]
    public void LoginWithInvalidPassword_ReturnsPasswordIncorrect()
    {
        //send valid username but wrong password
        Credentials credentials = new Credentials
        {
            username = "unittestaccount",
            password = "invalidpassword"
        };
        //ResultInfo executionResult = new ResultInfo();
        //executionResult = CallAPI(credentials, executionResult);
        //Assert.AreEqual("Password was incorrect", executionResult.error);
        LoginController loginController = new LoginController();
        var ResultTest = loginController.Post(credentials);
        Assert.AreEqual("Password was incorrect", ResultTest.error);

    }

    [TestMethod]
    public void LoginWithInvalidUsername_RetrunsCannotFindUser()
    {
        //send valid username but wrong password
        Credentials credentials = new Credentials
        {
            username = "invaliduser",
            password = "invalidpassword"
        };
        //ResultInfo executionResult = new ResultInfo();
        //executionResult = CallAPI(credentials, executionResult);
        //Assert.AreEqual("Could not find a login with that username", executionResult.error);
        LoginController loginController = new LoginController();
        var ResultTest = loginController.Post(credentials);
        Assert.AreEqual("Could not find a login with that username", ResultTest.error);

    }

    //private static ResultInfo CallAPI(Credentials credentials, ResultInfo executionResult)
    //{
    //    using (var client = new HttpClient())
    //    {

    //        client.BaseAddress = new Uri("https://localhost:7061/api/");
    //        //client.BaseAddress = new Uri(ConfigurationHelper.GetApiBaseURL());
    //        var jsonStringInput = Newtonsoft.Json.JsonConvert.SerializeObject(credentials);
    //        HttpContent httpContent = new StringContent(jsonStringInput, System.Text.Encoding.UTF8, "application/json");
    //        var response = client.PostAsync("login", httpContent).Result;

    //        if (response.IsSuccessStatusCode)
    //        {
    //            var jsonResultString = response.Content.ReadAsStringAsync();
    //            jsonResultString.Wait();
    //            executionResult = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultInfo>(jsonResultString.Result);

    //        }

    //    }

    //    return executionResult;
    //}

    [TestMethod]
    [DataRow("unittestaccount", "123456")]
    [DataRow("unittestadminaccount", "123456")]
    public void LoginWithCorrectCredentials_ReturnsNoError(string username, string password)
    {
        Credentials credentials = new Credentials
        {
            username = username,
            password = password
        };
        //ResultInfo executionResult = new ResultInfo();
        //executionResult = CallAPI(credentials, executionResult);
        //Assert.AreEqual("", executionResult.error);
        LoginController loginController = new LoginController();
        var ResultTest = loginController.Post(credentials);

        Assert.AreEqual("", ResultTest.error);
        
        if(username == "unittestadminaccount")
        {
            var updateQuery = @"UPDATE Student SET Hash = 'incompletehash' WHERE StudentId = 710;";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(updateQuery) > 0);
        }
    }

    [TestMethod]
    public void LoginWithValidCredential_ButNotRegisteredInCourse_ReturnsNotRegisteredError()
    {
        Credentials credentials = new Credentials
        {
            username = "unittestaccountwithoutcourses",
            password = "123456"
        };
        //ResultInfo executionResult = new ResultInfo();
        //executionResult = CallAPI(credentials, executionResult);
        //Assert.AreEqual("Student not registered in a course", executionResult.error);
        LoginController loginController = new LoginController();
        var ResultTest = loginController.Post(credentials);

        Assert.AreEqual("Student not registered in a course", ResultTest.error);
    }

    [TestMethod]
    public void LoginWithAdminCredential_ReturnsIsAdminTrue()
    {
        Credentials credentials = new Credentials
        {
            username = "s1",
            password = "p1"
        };
        //ResultInfo executionResult = new ResultInfo();
        //executionResult = CallAPI(credentials, executionResult);
        //Assert.AreEqual(true, executionResult.IsAdmin);
        LoginController loginController = new LoginController();
        var ResultTest = loginController.Post(credentials);

        Assert.AreEqual(true, ResultTest.IsAdmin);
    }

}
public class ResultInfo
{
    public string studentIdHash { get; set; }

    public string error { get; set; }
    public string StudentName { get; set; }
    public string Picture { get; set; }
    public bool IsAdmin { get; set; }
    public string AdminHash { get; set; }
}