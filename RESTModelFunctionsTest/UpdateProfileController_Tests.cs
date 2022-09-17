using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMSLibrary;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class UpdateProfileController_Tests
    {
        [TestMethod]
        public void UpdateProfileName_ReturnsOK()
        {
            Random random = new Random();
            string[] nameArray = { "New", "Unit", "Test", "Account" };
            var randomNameArray = nameArray.OrderBy(a => random.Next()).ToArray();
            var name = String.Join(" ", randomNameArray);
            var hash = "56639f07-c41c-4580-b717-375872278323";
            var controller = new UpdateProfileController();
            var response = controller.Post(new UpdateProfileStudentInfo { InfoType = "Name", Name = name, Hash = hash  });
            var okResponse = response.Result as OkObjectResult;

            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as UpdateProfileResultInfo;
            Assert.AreEqual(resultValue.Result, "OK");

            var sqlQuery = $"SELECT Name FROM Student WHERE Hash = '{hash}'";
            var queryResults = SQLHelper.RunSqlQuery(sqlQuery);

            Assert.IsNotNull(queryResults);
            Assert.AreEqual(queryResults[0][0].ToString(), name);
        }

        [TestMethod]
        public void UpdateProfilePassword_ReturnsOK()
        {
            var hash = "56639f07-c41c-4580-b717-375872278323";
            var controller = new UpdateProfileController();
            var response = controller.Post(new UpdateProfileStudentInfo { InfoType = "Password", Hash = hash, CurrentPassword = "123456", NewPassword = "123456"});
            var okResponse = response.Result as OkObjectResult;

            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as UpdateProfileResultInfo;
            Assert.AreEqual(resultValue.Result, "OK");

        }

        [TestMethod]
        public void UpdateProfilePasswordWithWrongPassword_ReturnsError()
        {
            var hash = "56639f07-c41c-4580-b717-375872278323";
            var controller = new UpdateProfileController();
            var response = controller.Post(new UpdateProfileStudentInfo { InfoType = "Password", Hash = hash, CurrentPassword = "invalid-current-password", NewPassword = "123456" });
            var okResponse = response.Result as OkObjectResult;

            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as UpdateProfileResultInfo;
            Assert.AreEqual(resultValue.Result, "Error");
        }

        [TestMethod]
        public void UpdateProfilePic_ReturnsOK()
        {
            var photofromdb = SQLHelper.RunSqlQuery("SELECT Photo FROM Student WHERE StudentId = 708;");
            var imageData = (byte[])photofromdb[0][0];
            var imageString = Convert.ToBase64String(imageData);
            var hash = "56639f07-c41c-4580-b717-375872278323";
            var controller = new UpdateProfileController();
            var response = controller.Post(new UpdateProfileStudentInfo { InfoType = "Photo", Hash = hash, Photo = imageString });
            var okResponse = response.Result as OkObjectResult;

            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as UpdateProfileResultInfo;
            Assert.AreEqual(resultValue.Result, "OK");
        }
    }
}
