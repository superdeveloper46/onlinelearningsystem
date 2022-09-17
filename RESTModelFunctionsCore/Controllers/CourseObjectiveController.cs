﻿using LMSLibrary;
using Microsoft.AspNetCore.Mvc;

namespace RESTModelFunctionsCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseObjectiveController : ControllerBase
    {
        [HttpPost]
        public ActionResult<CourseObjectiveResultInfo> Post([FromBody] CourseObjectiveStudentInfo si)
        {
            string sqlCommand = $@"SELECT C.Id, C.Name, CO.Id AS CourseObjectiveId, CO.Description AS CourseObjective,  M.Id AS ModuleId, M.Description AS Module, M.DueDate AS ModuleDueDate, MO.Description AS ModuleObjective
                                                FROM Course C
                                                INNER JOIN CourseCourseObjective CCO
                                                ON C.Id = CCO.CourseId
                                                INNER JOIN CourseObjective CO
                                                ON CCO.CourseObjectiveId = CO.Id
                                                INNER JOIN CourseInstance CI
                                                ON C.Id = CI.CourseId
                                                INNER JOIN CourseInstanceStudent CIS
                                                ON CI.Id = CIS.CourseInstanceId
                                                INNER JOIN Student S
                                                ON CIS.StudentId = S.StudentId
                                                INNER JOIN CourseObjectiveModule COM
                                                ON COM.CourseObjectiveId = CO.Id
                                                INNER JOIN Module M
                                                ON COM.ModuleId = M.Id
                                                INNER JOIN ModuleModuleObjective MMO
                                                ON MMO.ModuleId = M.Id
                                                INNER JOIN ModuleObjective MO
                                                ON MMO.ModuleObjectiveId = MO.Id
                                                WHERE CO.Active = 1 AND M.Active = 1 AND MO.Active = 1 AND S.Hash = '{si.Hash}' AND CIS.CourseInstanceId = {si.CourseInstanceId}
                                                ORDER BY CourseObjectiveId, ModuleId, ModuleObjective;";

            var sql = SQLHelper.RunSqlQuery(sqlCommand);

            if (si.Method == "GetCourseObjective")
            {
                CourseObjectiveCourseInfo courseInfo1 = new CourseObjectiveCourseInfo()
                {
                    Id = (sql.Count > 0 && sql[0].Count > 0) ? Convert.ToInt32(sql[0]?[0]) : 0,
                    Name = (sql.Count > 0 && sql[0].Count > 0) ? (string)sql[0][1] : "",
                    CourseObjectiveList = new List<CourseObjectiveInfo>()
                };

                CourseObjectiveInfo coInfo1 = new CourseObjectiveInfo
                {
                    Description = "",
                    Id = -1
                };

                CourseObjectiveResultInfo ri1 = new CourseObjectiveResultInfo()
                {
                    ModuleId = -1,
                    ModuleObjectives = "",
                    Description = "",
                    DueDate = ""
                };

                foreach (var co in sql)
                {
                    if (coInfo1.Id != Convert.ToInt32(co[2]))
                    {
                        coInfo1 = new CourseObjectiveInfo
                        {
                            Id = Convert.ToInt32(co[2]),
                            Description = (string)co[3],
                            Modules = new List<CourseObjectiveResultInfo>()
                        };
                        courseInfo1.CourseObjectiveList.Add(coInfo1);
                    }
                    if (ri1.ModuleId != Convert.ToInt32(co[4]))
                    {
                        ri1 = new CourseObjectiveResultInfo()
                        {
                            ModuleId = Convert.ToInt32(co[4]),
                            ModuleObjectives = "",
                            Description = (string)co[5],
                            DueDate = co[6].ToString()
                        };
                        coInfo1.Modules.Add(ri1);
                    }

                    if (ri1.ModuleObjectives != "")
                    {
                        ri1.ModuleObjectives += ", ";
                    }
                    ri1.ModuleObjectives += (string)co[7];
                }

                return Ok(courseInfo1);
            }
            else if (si.Method == "LoadGrades")
            {
                var data = GetCourseInstanceInfo(si.Hash, si.CourseInstanceId);
                int studentId = (int)data[0];
                var moduleGrades = GetModuleGradeInfo(studentId, si.CourseInstanceId);
                int courseId = (int)data[2];
                IList<CourseObjectiveInfo> coList = new List<CourseObjectiveInfo>();
                var courseObjectives = moduleGrades.GroupBy(x => x.CourseObjectiveId).Select(y => y.Key).ToList();
                foreach (var co in courseObjectives)
                {
                    int courseObjectiveId = co;
                    CourseObjectiveInfo coInfo = new CourseObjectiveInfo
                    {
                        Id = courseObjectiveId
                    };

                    var modules = moduleGrades.Where(x => x.CourseObjectiveId == courseObjectiveId);
                    IList<CourseObjectiveResultInfo> riList = new List<CourseObjectiveResultInfo>();
                    foreach (var module in modules)
                    {
                        int moduleId = module.ModuleId;
                        Gradebook moduleGradebook = GetGradebook(data, module);
                        int percent = (int)Math.Round(moduleGradebook.CalculateWeightedGrade());
                        int completion = (int)Math.Round(moduleGradebook.CalculateTotalCompletion());

                        CourseObjectiveResultInfo ri = new CourseObjectiveResultInfo()
                        {
                            ModuleId = moduleId,
                            Percent = percent,
                            Completion = completion,
                            StrokeDasharray = completion * 2.5 + " " + (500 - completion * 2.5),
                        };
                        riList.Add(ri);
                    }
                    coInfo.Modules = (List<CourseObjectiveResultInfo>)riList;
                    coList.Add(coInfo);
                }
                return Ok(coList);
            }
            else
            {
                return Ok();
            }
        }
        private static Gradebook GetGradebook(List<object> data, VmModuleGrade moduleGrade)
        {
            int studentId = (int)data[0];
            int courseInstanceId = (int)data[1];

            string[] resultGrades;
            var resultValue = moduleGrade;
            Gradebook moduleGradebook = new Gradebook();

            if (data[3].ToString() != "")
            {
                moduleGradebook.Quiz.Weight = (int)data[3];
                moduleGradebook.Assessment.Weight = (int)data[4];
                moduleGradebook.Material.Weight = (int)data[5];
                moduleGradebook.Discussion.Weight = (int)data[6];
                moduleGradebook.Poll.Weight = (int)data[7];
                moduleGradebook.Midterm.Weight = (int)data[8];
                moduleGradebook.Final.Weight = (int)data[9];
                //------------------AssessmentGrade----------------------
                resultGrades = resultValue.AssessmentGrade.ToString().Split(',');
                moduleGradebook.Assessment.Grade = Convert.ToInt32(resultGrades[0]);
                moduleGradebook.Assessment.Occurrence = Convert.ToInt32(resultGrades[1]);
                moduleGradebook.Assessment.Completion = Convert.ToInt32(resultGrades[2]);
                //------------------ActivityGrade----------------------
                resultGrades = resultValue.ActivityGrade.ToString().Split(',');
                moduleGradebook.Quiz.Grade = Convert.ToInt32(resultGrades[0]);
                moduleGradebook.Quiz.Occurrence = Convert.ToInt32(resultGrades[1]);
                moduleGradebook.Quiz.Completion = Convert.ToInt32(resultGrades[2]);

                moduleGradebook.Material.Grade = 0;
                moduleGradebook.Material.Occurrence = 0;
                moduleGradebook.Material.Completion = 0;
                //------------------DiscussionGrade----------------------
                resultGrades = resultValue.DiscussionGrade.ToString().Split(',');
                moduleGradebook.Discussion.Grade = Convert.ToInt32(resultGrades[0]);
                moduleGradebook.Discussion.Occurrence = Convert.ToInt32(resultGrades[1]);
                moduleGradebook.Discussion.Completion = Convert.ToInt32(resultGrades[2]);
                //------------------PollGrade----------------------
                resultGrades = resultValue.PollGrade.ToString().Split(',');
                moduleGradebook.Poll.Grade = Convert.ToInt32(resultGrades[0]);
                moduleGradebook.Poll.Occurrence = Convert.ToInt32(resultGrades[1]);
                moduleGradebook.Poll.Completion = Convert.ToInt32(resultGrades[2]);
                //------------------MidtermGrade----------------------
                resultGrades = resultValue.MidtermGrade.ToString().Split(',');
                moduleGradebook.Midterm.Grade = Convert.ToInt32(resultGrades[0]);
                moduleGradebook.Midterm.Occurrence = Convert.ToInt32(resultGrades[1]);
                moduleGradebook.Midterm.Completion = Convert.ToInt32(resultGrades[2]);
                //------------------FinalGrade----------------------                
                resultGrades = resultValue.FinalGrade.ToString().Split(',');
                moduleGradebook.Final.Grade = Convert.ToInt32(resultGrades[0]);
                moduleGradebook.Final.Occurrence = Convert.ToInt32(resultGrades[1]);
                moduleGradebook.Final.Completion = Convert.ToInt32(resultGrades[2]);
            }
            return moduleGradebook;
        }

        private static List<Object> GetCourseInstanceInfo(string hash, int courseInstanceId)
        {
            string sqlQuery = $@"select s.StudentId, gw.CourseInstanceId, ci.CourseId, ActivityWeight, AssessmentWeight, MaterialWeight,
                                        DiscussionWeight,PollWeight,MidtermWeight, FinalWeight  from Student s
                                        join CourseInstanceStudent cis on s.StudentId = cis.StudentId
                                        Join CourseInstance ci on cis.CourseInstanceId = ci.Id
                                        left Join GradeWeight gw on ci.Id = gw.CourseInstanceId
                                        where s.Hash= '{hash}'
                                        and ci.Id = {courseInstanceId}";

            var data = SQLHelper.RunSqlQuery(sqlQuery);
            return data.FirstOrDefault();
        }
        private static List<VmModuleGrade> GetModuleGradeInfo(int studentId, int courseInstanceId)
        {
            string sqlQuery = $@"exec ModuleGradeFullCourse {studentId}, {courseInstanceId}";
            var data = SQLHelper.RunSqlQuery(sqlQuery);
            List<VmModuleGrade> grades = new List<VmModuleGrade>();
            if (data.Count > 0)
            {
                foreach (var i in data)
                {
                    var mg = new VmModuleGrade
                    {
                        ActivityGrade = i[0].ToString(),
                        AssessmentGrade = i[1].ToString(),
                        FinalGrade = i[2].ToString(),
                        MidtermGrade = i[3].ToString(),
                        PollGrade = i[4].ToString(),
                        DiscussionGrade = i[5].ToString(),
                        CourseObjectiveId = (int)i[6],
                        ModuleId = (int)i[7],
                        ModuleObjectiveId = (int)i[8],

                    };
                    grades.Add(mg);
                }
            }
            return grades;
        }
    }
    public class CourseObjectiveStudentInfo
    {
        public string Hash { get; set; }
        public int CourseInstanceId { get; set; }
        public string Method { get; set; }
    }
    public class CourseObjectiveResultInfo
    {
        public int ModuleId { get; set; }
        public string ModuleObjectives { get; set; }
        public int Percent { get; set; }
        public int Completion { get; set; }
        public string Description { get; set; }
        public double GPA { get; set; }
        public string DueDate { get; set; }
        public string StrokeDasharray { get; set; }
    }
    public class VmModuleGrade
    {
        public string ActivityGrade { get; set; }
        public string AssessmentGrade { get; set; }
        public string FinalGrade { get; set; }
        public string MidtermGrade { get; set; }
        public string PollGrade { get; set; }
        public string DiscussionGrade { get; set; }
        public int CourseObjectiveId { get; set; }
        public int ModuleId { get; set; }
        public int ModuleObjectiveId { get; set; }
    }
    public class CourseObjectiveInfo
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public List<CourseObjectiveResultInfo> Modules { get; set; }
    }
    public class CourseObjectiveCourseInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<CourseObjectiveInfo> CourseObjectiveList { get; set; }
    }
}
