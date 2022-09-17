using System.Text.Json.Serialization;
using System.Xml.Linq;
//using EFModel;
using LMSLibrary;
using Microsoft.AspNetCore.Mvc;

namespace RESTAdminPagesCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        [HttpGet]
        //[Route("GetCourses")]
        public ActionResult<List<CourseInfo>> GetCourses([FromQuery] string name = "")
        {
            try
            {
                List<VmCourse> filterCourses = GetCourse();
                if (name != "")
                    filterCourses = filterCourses.Where(x => x.Name.Contains(name)).ToList();

                var courses = filterCourses.Select(x => new { Id = x.Id, Title = x.Name }).ToList();

                List<CourseInfo> resultInfo = new List<CourseInfo>();
                foreach (var mo in courses)
                {
                    CourseInfo info = new CourseInfo();
                    VmCourse course = new VmCourse();
                    course.Id = mo.Id;
                    course.Name = mo.Title;

                    info.Course = course;
                    resultInfo.Add(info);
                }

                return Ok(resultInfo);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        private List<VmCourse> GetCourse()
        {
            List<VmCourse> list = new List<VmCourse>();
            string sqlQueryStudent = $@"select Id, Name from Course";

            var courseData = SQLHelper.RunSqlQuery(sqlQueryStudent);

            if (courseData.Count > 0)
            {
                foreach (var item in courseData)
                {
                    VmCourse course = new VmCourse();
                    course.Id = (int)item[0];
                    course.Name = item[1].ToString();
                    list.Add(course);
                }
            }
            return list;
        }
    }
    public class CourseInfo
    {
        [JsonPropertyName("Course")]
        public VmCourse Course { get; set; }
    }
    public class VmCourse
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }
        [JsonPropertyName("Title")]
        public string Name { get; set; }
    }
}
