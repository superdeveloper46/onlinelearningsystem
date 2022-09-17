using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class SyllabusController_Tests
    {
        [TestMethod]
        public void GetSyllabusWithInvalidCourseInstanceId_ReturnsEmptySyllabusInfoObject()
        {
            var controller = new SyllabusController();
            var response = controller.Post(new SyllabusInfo { CourseInstanceId = -1 });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as SyllabusResultInfo;
            Assert.IsNotNull(resultValue);

            foreach (PropertyInfo pi in resultValue.GetType().GetProperties())
            {
                Assert.IsTrue(pi.GetValue(resultValue) == null || pi.GetValue(resultValue).IsDefault());
            }
        }

        [TestMethod]
        public void GetSyllabusWithValidCourseInstanceId_ReturnsSyllabusInfo()
        {
            var controller = new SyllabusController();
            var response = controller.Post(new SyllabusInfo { CourseInstanceId = 115 });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as SyllabusResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.CourseName, "courseforunittest");
            Assert.AreEqual(resultValue.CourseDescription.ToLower(), "course created for unit testing of application");
            Assert.AreEqual(resultValue.Credits, 10);
            Assert.AreEqual(resultValue.GradeScaleWeights.Count, 5);
            Assert.AreEqual(resultValue.GradeScaleWeights.Where(a => a.Description == "Poll").FirstOrDefault().Weight, 1);
            Assert.AreEqual(resultValue.GradeScaleWeights.Where(a => a.Description == "Quizzes").FirstOrDefault().Weight, 20);
            Assert.AreEqual(resultValue.GradeScaleWeights.Where(a => a.Description == "Assignments").FirstOrDefault().Weight, 45);
            Assert.AreEqual(resultValue.GradeScaleWeights.Where(a => a.Description == "Midterm").FirstOrDefault().Weight, 15);
            Assert.AreEqual(resultValue.GradeScaleWeights.Where(a => a.Description == "Final").FirstOrDefault().Weight, 19);
        }

        [TestMethod]
        public void GetSyllabusWithValidCourseWithGradeScales_ReturnsSyllabusInfo()
        {
            var controller = new SyllabusController();
            var response = controller.Post(new SyllabusInfo { CourseInstanceId = 118 });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as SyllabusResultInfo;
            Assert.IsNotNull(resultValue);

            Assert.IsTrue(resultValue.GradeScales.Count > 0);
        }
    }
}
