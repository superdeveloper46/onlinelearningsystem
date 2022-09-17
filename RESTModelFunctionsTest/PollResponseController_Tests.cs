using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMSLibrary;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class PollResponseController_Tests
    {
        [TestMethod]
        public void PollResponseWithoutMethod_ReturnsNullResponse()
        {
            var controller = new PollResponseController();
            var response = controller.Post(new PollResponseStudentInfo { Method = "" });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNull(okResponse);
        }

        [TestMethod]
        public void GetPollResponseWithValidInput_ReturnsValidPolls()
        {
            var controller = new PollResponseController();
            var response = controller.Post(new PollResponseStudentInfo { Method = "Get", CourseInstanceId = 115, Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", ModuleObjectiveId = 498, PollGroupId = 38 });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as PollResponseResultInfo;
            Assert.IsNotNull(resultValue != null && resultValue.QuestionItems != null && resultValue.QuestionItems.Count > 0);

            PollQuestionItem? pollQuestion = null;
            if (resultValue != null && resultValue.QuestionItems != null)
            {
                pollQuestion = resultValue.QuestionItems.Where(a => a.PollQuestionId == 172).FirstOrDefault();
            }
            Assert.IsNotNull(pollQuestion);
            Assert.AreEqual(pollQuestion.PollQuestion, "Should we write tests for exceptions?");
        }

        [TestMethod]
        public void GetPollResponseWithInvalidInput_ReturnsZeroPolls()
        {
            var controller = new PollResponseController();
            var response = controller.Post(new PollResponseStudentInfo { Method = "Get", CourseInstanceId = -1, Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", ModuleObjectiveId = -1, PollGroupId = -1 });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as PollResponseResultInfo;
            Assert.IsNotNull(resultValue != null && resultValue.QuestionItems != null && resultValue.QuestionItems.Count == 0);
        }

        [TestMethod]
        [DataRow("19ddd2a1-8cae-46ca-b173-c070e5398e39")]
        [DataRow("bce20431-5af2-4837-812f-5a2c5b65ce53")]
        public void AddPollResponseAgain_ReturnsPostSaved(string studentHash)
        {
            var controller = new PollResponseController();
            var si = new PollResponseStudentInfo { Method = "Add", CourseInstanceId = 115, Hash = studentHash, ModuleObjectiveId = 498, PollGroupId = 38 };
            si.StudentResponses = new List<studentResponse>
            {
                new studentResponse{ OptionId = 506,  PollQuestionId = 172 },
            };
            var response = controller.Post(si);

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as PollQuestionItem;
            Assert.IsNotNull(resultValue != null && resultValue.Result == "Your post was saved");

            if(studentHash == "19ddd2a1-8cae-46ca-b173-c070e5398e39")
            {
                var deleteQuery = @"DELETE FROM PollParticipantAnswer WHERE PollQuestionId = 172 AND PollOptionId = 506 AND PollGroupId = 38 AND StudentId = 741";
                Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
            }
        }

        [TestMethod]
        public void AddTextPollRespone_ReturnsPostSaved()
        {
            var controller = new PollResponseController();
            var si = new PollResponseStudentInfo { Method = "Add", CourseInstanceId = 115, Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", ModuleObjectiveId = 498, PollGroupId = 38 };
            si.StudentResponses = new List<studentResponse>
            {
                new studentResponse{ TextAnswer = "Poll answer",  PollQuestionId = 173 },
            };
            var response = controller.Post(si);

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(200, okResponse.StatusCode);

            var resultValue = okResponse.Value as PollQuestionItem;
            Assert.IsNotNull(resultValue != null && resultValue.Result == "Your post was saved");

            var deleteQuery = @"Delete from PollParticipantAnswer WHERE StudentId = 708 AND PollQuestionId = 173 AND PollGroupId = 38 AND CourseInstanceId = 115;";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
        }

        [TestMethod]
        [ExpectedException(typeof(NullReferenceException))]
        public void AddPollResponseWithInvalidInput_ThrowsException()
        {
            var controller = new PollResponseController();
            var si = new PollResponseStudentInfo { Method = "Add", CourseInstanceId = -1, Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", ModuleObjectiveId = -1, PollGroupId = -1 };

            var response = controller.Post(si);

        }
    }
}
