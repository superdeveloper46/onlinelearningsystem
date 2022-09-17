using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMSLibrary;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class StudentRequestLoginController_Tests
    {
        [TestMethod]
        public void StudentRequestLoginWithoutInputData_ReturnsError()
        {
            var controller = new StudentRequestLoginController();
            var response = controller.Post(new StudentRequestLoginStudentInfo { });
            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as StudentRequestLoginResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.IsFalse(resultValue.Success);
            var ex = new NullReferenceException();
            Assert.AreEqual(resultValue.Message, ex.Message);
        }

        [TestMethod]
        public void StudentRequestLoginWithValidInputData_ReturnsSuccess()
        {
            var courseName = "TestCourseForUnitTesting";
            var email = "contact@hamzaanwar.info";
            var name = "Hamza";
            var schoolName = "C.B.A. School";
            var controller = new StudentRequestLoginController();
            var response = controller.Post(new StudentRequestLoginStudentInfo { CourseName = courseName, Email = email, Name = name, SchoolName = schoolName });
            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as StudentRequestLoginResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.IsTrue(resultValue.Success);

            var deleteQuery = $@"DELETE FROM RequestLogin Where CourseName = '{courseName}' AND Email = '{email}' AND name = '{name}' AND SchoolName = '{schoolName}' ";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
        }
    }
}
