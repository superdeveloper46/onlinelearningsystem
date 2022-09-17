using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMSLibrary;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class SubmitController_Tests
    {
        [TestMethod]
        public void SubmitValidAnswer_ReturnsQuestionDetails()
        {
            int studentId = 712;
            int questionId = 2400;
            string answer = "4";
            string studentHash = "56639f07-c41c-4580-b717-375872278323";
            var controller = new SubmitController();
            var response = controller.Post(new QuestionInfo { History = "", QuestionId = questionId, Answer = answer, StudentId = studentHash });
            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as SubmitResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.Grade, 1);

            var deleteQuery = $@"DELETE FROM StudentQuizQuestion Where StudentId = {studentId} AND Answer = '{answer}' AND Expected = '{answer}' AND QuestionId = {questionId} AND Grade =  {resultValue.Grade}";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
        }

        [TestMethod]
        [ExpectedException(typeof(NullReferenceException))]
        [DataRow(2400)]
        [DataRow(2401)]
        public void SubmitQuizWithoutAnswer_ThrowsException(int questionId)
        {
            var controller = new SubmitController();
            var response = controller.Post(new QuestionInfo { History = "", QuestionId = questionId, StudentId = "bce20431-5af2-4837-812f-5a2c5b65ce53" });

        }

    }
}
