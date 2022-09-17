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
    public class ModuleObjectivesController : ControllerBase
    {
        #region Test Code
        //[HttpGet]
        //public ActionResult<List<ModuleObjectiveInfo>> GetModuleObjectivesGet(string name = "", int courseId = 0)
        //{
        //    try
        //    {
        //        string LikeString = "";
        //        if (name != "")
        //        {
        //            LikeString = @"and mo.Description like '%" + name + "%'";
        //        }

        //        var modelObjectives = GetModuleObjectiveUsingJoin(LikeString, courseId);

        //        List<ModuleObjectiveInfo> resultInfo = new List<ModuleObjectiveInfo>();
        //        foreach (var mo in modelObjectives)
        //        {
        //            ModuleObjectiveInfo info = new ModuleObjectiveInfo();
        //            ModuleObjectiveResponse modelObjective = new ModuleObjectiveResponse();

        //            modelObjective.Id = mo.Id;
        //            modelObjective.Title = mo.Description;

        //            info.ModuleObjective = modelObjective;
        //            resultInfo.Add(info);
        //        }

        //        return Ok(resultInfo);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}

        #endregion

        // GET: api/ModuleObjectives

        [HttpGet]
        //[HttpGet("{name}/{courseId}")]
        //[HttpGet("{name}/{courseId:int}")]
        //[Route("api/ModuleObjectives/{name}/{courseId:int}")]
        public ActionResult<List<ModuleObjectiveInfo>> GetModuleObjectives([FromQuery] string name = "", [FromQuery] int courseId = 0)
        {
            try
            {
                string LikeString = "";
                if (name != "")
                {
                    LikeString = @"and mo.Description like '%" + name + "%'";
                }

               var modelObjectives = GetModuleObjectiveUsingJoin(LikeString, courseId);

                List<ModuleObjectiveInfo> resultInfo = new List<ModuleObjectiveInfo>();
                foreach (var mo in modelObjectives)
                {
                    ModuleObjectiveInfo info = new ModuleObjectiveInfo();
                    ModuleObjectiveResponse modelObjective = new ModuleObjectiveResponse();

                    modelObjective.Id = mo.Id;
                    modelObjective.Title = mo.Description;

                    info.ModuleObjective = modelObjective;
                    resultInfo.Add(info);
                }

                return Ok(resultInfo);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        private List<VmModuleObjective> GetModuleObjective()
        {
            List<VmModuleObjective> list = new List<VmModuleObjective>();
            string sqlQueryLanguage = $@"select * from ModuleObjective where Active = 1";

            var objectiveData = SQLHelper.RunSqlQuery(sqlQueryLanguage);

            if (objectiveData.Count > 0)
            {
                foreach (var item in objectiveData)
                {
                    VmModuleObjective moduleObjective = new VmModuleObjective();
                    moduleObjective.Description = item[0].ToString();
                    moduleObjective.Active = (bool)item[1];
                    moduleObjective.Id = (int)item[2];
                    moduleObjective.DueDate = item[3] == null ? null : (DateTime)item[3];
                    list.Add(moduleObjective);
                }
            }
            return list;
        }
        private List<VmModuleObjective> GetModuleObjectiveUsingJoin(string likeString, int courseId)
        {
            List<VmModuleObjective> list = new List<VmModuleObjective>();
            string sqlQueryLanguage = $@"select mo.Description,mo.Id from ModuleObjective as mo
                                        inner join ModuleModuleObjective as mmo on mo.Id = mmo.ModuleObjectiveId
                                        inner join Module as m on mmo.ModuleId = m.Id
                                        inner join CourseObjectiveModule as com on m.Id = com.ModuleId
                                        inner join CourseObjective as co on com.CourseObjectiveId = co.Id
                                        inner join CourseCourseObjective as cco on co.Id = cco.CourseObjectiveId
                                        inner join Course as c on cco.CourseId = c.Id
                                        where mo.Active = 1 and m.Active = 1 and co.Active = 1 and c.Id = {courseId}
                                        {likeString}
                                        order by mo.Id asc";

            var objectiveData = SQLHelper.RunSqlQuery(sqlQueryLanguage);

            if (objectiveData.Count > 0)
            {
                foreach (var item in objectiveData)
                {
                    VmModuleObjective moduleObjective = new VmModuleObjective();
                    moduleObjective.Description = item[0].ToString();
                    moduleObjective.Id = (int)item[1];
                    list.Add(moduleObjective);
                }
            }
            return list;
        }
    }
    public class ModuleObjectiveInfo
    {
        [JsonPropertyName("ModuleObjective")]
        public ModuleObjectiveResponse ModuleObjective { get; set; }
    }
    public class ModuleObjectiveResponse
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }
        [JsonPropertyName("Title")]
        public string Title { get; set; }
    }

}
