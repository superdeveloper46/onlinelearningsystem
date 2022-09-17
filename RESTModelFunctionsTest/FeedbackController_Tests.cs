using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMSLibrary;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class FeedbackController_Tests
    {
        [TestMethod]
        [DataRow(true)]
        [DataRow(false)]
        public void GetFeedbackList_ReturnsFeedbacks(bool onlyme)
        {
            var controller = new FeedbackController();
            var result = controller.Post(new FeedbackIncomingInfo { Method = "GetList", CourseInstanceId = 115, StudentHash = "bce20431-5af2-4837-812f-5a2c5b65ce53", OnlyMine = onlyme });
            var okResult = result.Result as OkObjectResult;

            Assert.IsNotNull(okResult);
            Assert.AreEqual(okResult.StatusCode, 200);

            var resultValue = okResult.Value as FeedbackResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.IsNotNull(resultValue.CourseName);
            Assert.IsTrue(resultValue.FeedbackList.Count > 0);
        }

        [TestMethod]
        public void FeedbackControllerWithoutMethod_ReturnsEmptyResponse()
        {
            var controller = new FeedbackController();
            var result = controller.Post(new FeedbackIncomingInfo { Method = "", StudentHash = "bce20431-5af2-4837-812f-5a2c5b65ce53" });
            var okResult = result.Result as OkObjectResult;

            Assert.AreEqual(okResult.Value, "");
        }

        [TestMethod]
        public void GetCourses_ReturnsCourses()
        {
            var controller = new FeedbackController();
            var result = controller.Post(new FeedbackIncomingInfo { Method = "GetCourses", StudentHash = "bce20431-5af2-4837-812f-5a2c5b65ce53" });
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(okResult.StatusCode, 200);

            var resultValue = okResult.Value as List<StudentCourse>;
            Assert.IsNotNull(resultValue);
            Assert.IsTrue(resultValue.Count > 0);
        }

        [TestMethod]
        public void SaveFeedback_ReturnsOkResult()
        {
            var feedbackMessage = "temporary feedback for save unit test";
            var controller = new FeedbackController();
            var result = controller.Post(new FeedbackIncomingInfo { Method = "Save", CourseInstanceId = 115, StudentHash = "bce20431-5af2-4837-812f-5a2c5b65ce53", Feedback = feedbackMessage });
            var okResult = result.Result as OkObjectResult;

            Assert.IsNotNull(okResult);

            var resultValue = (int)okResult.Value;
            Assert.AreEqual(resultValue, 1);

            var deleteQuery = $@"DELETE FROM Feedback Where StudentId = 708 AND Text = '{feedbackMessage}' AND CourseInstanceId = 115; ";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
        }
    }
}
