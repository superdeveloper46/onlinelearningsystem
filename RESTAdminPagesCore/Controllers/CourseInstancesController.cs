using System.Text.Json.Serialization;
using System.Xml.Linq;
//using EFModel;
using LMS.Common.ViewModels;
using LMSLibrary;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace RESTAdminPagesCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseInstancesController : ControllerBase
    {
        #region Test Code
        //[HttpGet]
        //public ActionResult<List<dynamic>> GetCourseInstancesGet(int courseId = 0, string quarterName = "", string instanceName = "", bool getQuarter = false)
        //{
        //    try
        //    {
        //        string quarterSql = "";
        //        string quarterSelectSql = "";
        //        string quarterConditionSql = "";
        //        string courseSql = "";
        //        string courseSelectSql = "";
        //        string courseConditionSql = "";
        //        if (quarterName != "")
        //        {
        //            quarterSql = @" inner join Quarter as q on ci.QuarterId = q.QuarterId ";
        //            quarterSelectSql = @",(CAST(q.StartDate as varchar) +' TO ' + CAST(q.EndDate as varchar)) as Quarters ";
        //            quarterConditionSql = @" and q.Name like '%" + quarterName + "%' ";
        //        }
        //        if (instanceName != "")
        //        {
        //            courseSql = @" inner join Course as c on ci.CourseId = c.Id ";
        //            courseSelectSql = @",c.Name as CourseName ";
        //            courseConditionSql = @" and c.Name like '%" + instanceName + "%' ";
        //        }

        //        if (getQuarter)
        //        {
        //            var courseInstances = GetQuarterCourseInstance(quarterSelectSql, quarterSql, quarterConditionSql, courseSelectSql, courseSql, courseConditionSql, courseId);

        //            List<QuarterInfo> resultInfo = new List<QuarterInfo>();
        //            foreach (var ci in courseInstances)
        //            {
        //                QuarterInfo info = new QuarterInfo();
        //                ResultInfo quarterresultInfo = new ResultInfo();

        //                quarterresultInfo.Id = ci.Id;
        //                quarterresultInfo.Title = ci.Quarters;

        //                info.quarterInfo = quarterresultInfo;
        //                resultInfo.Add(info);
        //            }

        //            return Ok(resultInfo);
        //        }
        //        else
        //        {
        //            var courseInstances = GetQuarterCourseInstance(quarterSelectSql, quarterSql, quarterConditionSql, courseSelectSql, courseSql, courseConditionSql, courseId);

        //            List<CourseInstanceInfo> resultInfo = new List<CourseInstanceInfo>();
        //            foreach (var ci in courseInstances)
        //            {
        //                CourseInstanceInfo info = new CourseInstanceInfo();
        //                ResultInfo courseInstancerResultInfo = new ResultInfo();

        //                courseInstancerResultInfo.Id = ci.Id;
        //                courseInstancerResultInfo.Title = ci.CourseName;

        //                info.CourseInstance = courseInstancerResultInfo;
        //                resultInfo.Add(info);
        //            }

        //            return Ok(resultInfo);
        //        }


        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}

        #endregion

        // GET: api/CourseInstances
        [HttpGet]
        //[HttpGet("{courseId}/{quarterName}/{instanceName}/{getQuarter}")]
        //[Route("{courseId}/{quarterName}/{instanceName}/{getQuarter}")]
        public ActionResult<List<dynamic>> GetCourseInstances([FromQuery] int courseId = 0, [FromQuery] string quarterName = "", [FromQuery] string instanceName = "", [FromQuery] bool getQuarter = false)
        {
            try
            {
                string quarterSql = "";
                string quarterSelectSql = "";
                string quarterConditionSql = "";
                string courseSql = "";
                string courseSelectSql = "";
                string courseConditionSql = "";
                if (quarterName != "")
                {
                    quarterSql = @" inner join Quarter as q on ci.QuarterId = q.QuarterId ";
                    quarterSelectSql = @",(CAST(q.StartDate as varchar) +' TO ' + CAST(q.EndDate as varchar)) as Quarters ";
                    quarterConditionSql = @" and q.Name like '%" + quarterName + "%' ";
                }
                if (instanceName != "")
                {
                    courseSql = @" inner join Course as c on ci.CourseId = c.Id ";
                    courseSelectSql = @",c.Name as CourseName ";
                    courseConditionSql = @" and c.Name like '%" + instanceName + "%' ";
                }

                if (getQuarter)
                {
                    var courseInstances = GetQuarterCourseInstance(quarterSelectSql, quarterSql, quarterConditionSql, courseSelectSql, courseSql, courseConditionSql, courseId);

                    List<QuarterInfo> resultInfo = new List<QuarterInfo>();
                    foreach (var ci in courseInstances)
                    {
                        QuarterInfo info = new QuarterInfo();
                        ResultInfo quarterresultInfo = new ResultInfo();
                        
                        quarterresultInfo.Id = ci.Id;
                        quarterresultInfo.Title = ci.Quarters;

                        info.quarterInfo = quarterresultInfo;
                        resultInfo.Add(info);
                    }

                    return Ok(resultInfo);
                }
                else
                {
                   var courseInstances = GetQuarterCourseInstance(quarterSelectSql, quarterSql, quarterConditionSql, courseSelectSql, courseSql, courseConditionSql, courseId);

                    List<CourseInstanceInfo> resultInfo = new List<CourseInstanceInfo>();
                    foreach (var ci in courseInstances)
                    {
                        CourseInstanceInfo info = new CourseInstanceInfo();
                        ResultInfo courseInstancerResultInfo = new ResultInfo();

                        courseInstancerResultInfo.Id = ci.Id;
                        courseInstancerResultInfo.Title = ci.CourseName;

                        info.CourseInstance = courseInstancerResultInfo;
                        resultInfo.Add(info);
                    }

                    return Ok(resultInfo);
                }

               
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private List<VmCourseInstance> GetCourseInstance(int courseId)
        {
            List<VmCourseInstance> list = new List<VmCourseInstance>();
            string sqlQueryLanguage = $@"select * from CourseInstance where CourseId = {courseId} and Active = 1";

            var objectiveData = SQLHelper.RunSqlQuery(sqlQueryLanguage);

            if (objectiveData.Count > 0)
            {
                foreach (var item in objectiveData)
                {
                    VmCourseInstance courseInstance = new VmCourseInstance();
                    courseInstance.Id = (int)item[0];
                    courseInstance.Active = item[1] != DBNull.Value ? (bool)item[1] : false;
                    courseInstance.QuarterId = item[2] != DBNull.Value ? (int)item[2] : 0;
                    courseInstance.CourseId = item[3] != DBNull.Value ? (int)item[3] : 0;
                    courseInstance.Testing = item[4] != DBNull.Value ? (bool)item[4] : false;
                    list.Add(courseInstance);
                }
            }
            return list;
        }
        private List<CourseInstanceData> GetQuarterCourseInstance(string selectQuarterSql, string innerQuarter, string conditionQuarter, string selectCourseSql, string innerCourse, string conditionCourse, int courseId)
        {
            List<CourseInstanceData> list = new List<CourseInstanceData>();
            string sqlQueryLanguage = $@"select ci.Id {selectQuarterSql} {selectCourseSql} from CourseInstance as ci
                                        {innerQuarter}
                                        {innerCourse}
                                        where ci.CourseId = {courseId} and ci.Active = 1 
                                        {conditionQuarter}
                                        {conditionCourse}
                                        order by ci.Id asc";

            var objectiveData = SQLHelper.RunSqlQuery(sqlQueryLanguage);

            if (objectiveData.Count > 0)
            {
                foreach (var item in objectiveData)
                {
                    CourseInstanceData courseInstance = new CourseInstanceData();
                    courseInstance.Id = (int)item[0];
                    courseInstance.Quarters = item[1] != DBNull.Value ? item[1].ToString() : string.Empty;
                    list.Add(courseInstance);
                }
            }
            return list;
        }
        private List<CourseInstanceData> GetDataCourseInstance(string selectQuarterSql, string innerQuarter, string conditionQuarter, string selectCourseSql, string innerCourse, string conditionCourse, int courseId)
        {
            List<CourseInstanceData> list = new List<CourseInstanceData>();
            string sqlQueryLanguage = $@"select ci.Id {selectCourseSql} from CourseInstance as ci
                                        {innerQuarter} {innerCourse} where ci.CourseId = {courseId} and ci.Active = 1 
                                        {conditionQuarter}
                                        {conditionCourse}
                                        order by ci.Id asc";

            var objectiveData = SQLHelper.RunSqlQuery(sqlQueryLanguage);

            if (objectiveData.Count > 0)
            {
                foreach (var item in objectiveData)
                {
                    CourseInstanceData courseInstance = new CourseInstanceData();
                    courseInstance.Id = (int)item[0];
                    courseInstance.CourseName = item[1].ToString();
                    list.Add(courseInstance);
                }
            }
            return list;
        }
    }

    public class ResultInfo
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("Title")]
        public string Title { get; set; }    
    }
    public class QuarterInfo
    {
        [JsonPropertyName("Quarter")]
        public ResultInfo quarterInfo { get; set; }
    }
    public class CourseInstanceInfo
    {
        [JsonPropertyName("CourseInstance")]
        public ResultInfo CourseInstance { get; set; }
    }

    public class CourseInstanceData
    {
        public int Id { get; set; }
        public string Quarters { get; set; }
        public string CourseName { get; set; }
    }
}

