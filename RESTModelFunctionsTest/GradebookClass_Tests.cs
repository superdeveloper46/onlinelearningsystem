using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMSLibrary;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class GradebookClass_Tests
    {
        [TestMethod]
        public void AddAndNormalizeGrade_SetValidValues()
        {
            var gradinginfowithweight = new Gradebook.ActivityGradeInfo { Weight = 1, Occurrence = 2, Completion = 1 };
            var gradebookvalues = new Gradebook
            {
                Assessment = gradinginfowithweight, 
                Discussion = gradinginfowithweight,  
                Final = gradinginfowithweight, 
                Material = gradinginfowithweight, 
                Midterm = gradinginfowithweight, 
                Poll = gradinginfowithweight, 
                Quiz = gradinginfowithweight
            };
            Gradebook gradebook = new Gradebook(gradebookvalues);

            gradebook.Add(gradebookvalues);

            //Should be 2 before normalizing
            Assert.AreEqual(gradebook.Assessment.Occurrence, 2);
            Assert.AreEqual(gradebook.Quiz.Occurrence, 2);
            Assert.AreEqual(gradebook.Midterm.Occurrence, 2);
            Assert.AreEqual(gradebook.Material.Occurrence, 2);
            Assert.AreEqual(gradebook.Final.Occurrence, 2);
            Assert.AreEqual(gradebook.Assessment.Occurrence, 2);
            Assert.AreEqual(gradebook.Discussion.Occurrence, 2);
            Assert.AreEqual(gradebook.Poll.Occurrence, 2);

            Assert.AreEqual(gradebook.Assessment.Completion, 1);
            Assert.AreEqual(gradebook.Quiz.Completion, 1);
            Assert.AreEqual(gradebook.Midterm.Completion, 1);
            Assert.AreEqual(gradebook.Material.Completion, 1);
            Assert.AreEqual(gradebook.Final.Completion, 1);
            Assert.AreEqual(gradebook.Assessment.Completion, 1);
            Assert.AreEqual(gradebook.Discussion.Completion, 1);
            Assert.AreEqual(gradebook.Poll.Completion, 1);

            gradebook.NormalizeGrade();

            Assert.AreEqual(gradebook.Assessment.Occurrence, 1);
            Assert.AreEqual(gradebook.Quiz.Occurrence, 1);
            Assert.AreEqual(gradebook.Midterm.Occurrence, 1);
            Assert.AreEqual(gradebook.Material.Occurrence, 1);
            Assert.AreEqual(gradebook.Final.Occurrence, 1);
            Assert.AreEqual(gradebook.Assessment.Occurrence, 1);
            Assert.AreEqual(gradebook.Discussion.Occurrence, 1);
            Assert.AreEqual(gradebook.Poll.Occurrence, 1);

            Assert.AreEqual(gradebook.Assessment.Completion, 0);
            Assert.AreEqual(gradebook.Quiz.Completion, 0);
            Assert.AreEqual(gradebook.Midterm.Completion, 0);
            Assert.AreEqual(gradebook.Material.Completion, 0);
            Assert.AreEqual(gradebook.Final.Completion, 0);
            Assert.AreEqual(gradebook.Assessment.Completion, 0);
            Assert.AreEqual(gradebook.Discussion.Completion, 0);
            Assert.AreEqual(gradebook.Poll.Completion, 0);
        }

        [TestMethod]
        [DataRow(100, "A+")]
        [DataRow(99, "A")]
        [DataRow(92, "A-")]
        [DataRow(89, "B+")]
        [DataRow(85, "B")]
        [DataRow(83, "B-")]
        [DataRow(80, "C+")]
        [DataRow(78, "C")]
        [DataRow(65, "D+")]
        public void GetLetterGradeWithTotalCompletion_ReturnsValidCompletion(int completion, string expectedGrade)
        {
            Gradebook gradebook = new Gradebook();
            var grade = gradebook.GetLetterGrade(completion, 1);
            Assert.AreEqual(grade, expectedGrade);
        }
    }
}
