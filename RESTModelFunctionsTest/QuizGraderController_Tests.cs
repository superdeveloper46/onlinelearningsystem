using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class QuizGraderController_Tests
    {
        [TestMethod]
        public void CalculateGradeWithValidValues_ReturnsTotalShownAndTotalGrade()
        {
            var vmActivity = new VmActivity { Id = 558 };
            var vmStudent = new VmStudent { StudentId = 708 };
            QuizGrader.CalculateGrade(vmActivity, vmStudent, out int quizGrade, out int totalGrade, out int totalShown);

            Assert.AreEqual(quizGrade, 0);
            Assert.AreEqual(totalGrade, 0);
            Assert.AreEqual(totalShown, 0);
        }

        [TestMethod]
        public void GetMaxQuizGrage_ReturnsMaxQuiz()
        {
            var maxquizgrade = QuizGrader.GetMaxQuizGrade(activityId: 558);
            Assert.AreEqual(maxquizgrade, 5);
        }
    }
}
