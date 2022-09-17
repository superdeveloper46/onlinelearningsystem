﻿using LMSLibrary;
using Microsoft.AspNetCore.Mvc;

namespace RESTModelFunctionsCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialController : ControllerBase
    {
        [HttpPost]
        public ActionResult<MaterialResultInfo> Post([FromBody] QuestionSetInfo qsi)
        {
            Dictionary<int, QuestionHint> quizQuestionHints = new Dictionary<int, QuestionHint>();
            var quizQuestionData = QuestionController.GetQuizQuestions(qsi.StudentHash, qsi.QuestionSetId);

            var materials = GetMaterialInfo(qsi.QuestionSetId);

            QuestionResultInfo? quizQuestion = quizQuestionData?.FirstOrDefault();
            string? title = quizQuestion == null ? "" : quizQuestion.Title;

            // Adjust the title to become: [CourseName QuizTitle]
            if (title.Length > 0 && qsi.CourseInstanceId > 0)
            {
                string sqlQuery = $@"SELECT [Name] FROM [dbo].[Course] AS C
                                    JOIN [dbo].[CourseInstance] AS CI ON CI.CourseId = C.Id
                                    WHERE CI.Id = {qsi.CourseInstanceId}";
                var sqlRows = SQLHelper.RunSqlQuery(sqlQuery);
                if (sqlRows.Count > 0) if (sqlRows[0].Count > 0) {
                    title = sqlRows[0][0].ToString() + " " + title;
                }
            }

            QuizGrader.CalculateQuizGrade(quizQuestionData, out int recalculatedGrade, out int totalGrade, out int totalShown);

            MaterialResultInfo materialResultInfo = new MaterialResultInfo
            {
                QuizQuestions = quizQuestionData,
                QuizQuestionHints = quizQuestionHints,
                TotalGrade = totalGrade,
                TotalShown = totalShown,
                Title = title,
                Materials = materials
            };
            return Ok(materialResultInfo);
        }
        private static List<MaterialInfo> GetMaterialInfo(int activityId)
        {
            string sqlQuery = $@"select m.Title, m.Description from ActivityMaterial am
                                join Material m on am.MaterialId = m.Id
                                where ActivityId = {activityId}";

            var data = SQLHelper.RunSqlQuery(sqlQuery);
            List<MaterialInfo> meterials = new List<MaterialInfo>();
            if (data.Count > 0)
            {
                foreach (var i in data)
                {
                    var mi = new MaterialInfo
                    {
                        Title = i[0].ToString(),
                        Link = i[1].ToString()
                    };
                    meterials.Add(mi);
                }
            }
            return meterials;
        }
    }
    public class MaterialResultInfo
    {
        public List<QuestionResultInfo> QuizQuestions { get; set; }
        public Dictionary<int, QuestionHint> QuizQuestionHints { get; set; }
        public int TotalGrade { get; set; }
        public int TotalShown { get; set; }
        public string Title { get; set; }
        public List<MaterialInfo> Materials { get; set; }
    }
    public class QuestionSetInfo
    {
        public int QuestionSetId { get; set; }
        public string QuestionSetType { get; set; }
        public string StudentHash { get; set; }
        public int CourseInstanceId { get; set; }
    }
    public class QuestionHint
    {
        public int HintId { get; set; }
        public string Hint { get; set; }
        public int HintRating { get; set; }
    }
    public class MaterialInfo
    {
        public string Title { get; set; }
        public string Link { get; set; }
    }
}
