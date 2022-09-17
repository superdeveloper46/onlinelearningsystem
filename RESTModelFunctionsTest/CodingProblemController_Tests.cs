using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class CodingProblemController_Tests
    {
        [TestMethod]
        [ExpectedException(typeof(NullReferenceException))]
        [DataRow(-1, 115, "bce20431-5af2-4837-812f-5a2c5b65ce53")]
        [DataRow(341, 115, "invalid-hash")]
        public void GetCodingProblemWithInvalidIdOrHash_ThrowsException(int codingProblemId, int courseInstanceId, string hash)
        {
            var controller = new CodingProblemController();
            var response = controller.Post(new CodingProblemInput { CodingProblemId = codingProblemId, CourseInstanceId = courseInstanceId, Hash = hash });
        }

        [TestMethod]
        [DataRow(341, -1, "bce20431-5af2-4837-812f-5a2c5b65ce53")]
        public void GetCodingProblemWithInvalidCourseInstanceId_ReturnsNullDueDate(int codingProblemId, int courseInstanceId, string hash)
        {
            var controller = new CodingProblemController();
            var response = controller.Post(new CodingProblemInput { CodingProblemId = codingProblemId, CourseInstanceId = courseInstanceId, Hash = hash });

            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var responseValue = JsonConvert.SerializeObject(okResponse.Value);
            var responseValueObj = JsonConvert.DeserializeObject(responseValue) as dynamic;
            Assert.IsNotNull(responseValue);
            int submissions = responseValueObj.submissions;
            Assert.AreEqual(submissions, 0);
            string dueDate = responseValueObj.dueDate;            
            Assert.IsNull(dueDate);
        }


        [TestMethod]
        [DataRow(341, 115, "bce20431-5af2-4837-812f-5a2c5b65ce53")]
        [DataRow(349, 115, "bce20431-5af2-4837-812f-5a2c5b65ce53")]
        public void GetCodingProblemWithValidValues_ReturnsCodingProblem(int codingProblemId, int courseInstanceId, string hash)
        {
            var controller = new CodingProblemController();
            var response = controller.Post(new CodingProblemInput { CodingProblemId = codingProblemId, CourseInstanceId = courseInstanceId, Hash = hash });

            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var responseValue = JsonConvert.SerializeObject(okResponse.Value);
            var responseValueObj = JsonConvert.DeserializeObject(responseValue) as dynamic;
            string title = responseValueObj.Title;
            Assert.IsNotNull(title, "Coding problem for unit testing");            
            string instructions = responseValueObj.Instructions;
            Assert.IsNotNull(instructions, "<p>Write a statement to assert if variables a and b are equal.&nbsp;</p>");
            string language = responseValueObj.Language;
            Assert.AreEqual(language, "C#");
            Assert.IsNotNull(responseValue);

        }

    }
}
