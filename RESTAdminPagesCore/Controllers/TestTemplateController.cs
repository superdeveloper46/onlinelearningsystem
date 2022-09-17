using System.Text.Json.Serialization;
using System.Xml.Linq;
//using EFModel;
using LMSLibrary;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace RESTAdminPagesCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestTemplateController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<TestTemplateResultInfo>> Get([FromQuery] String languageName)
        {
            List<VmTestTemplate> testTemplates = GetTestTemplate(languageName);
            
            List<TestTemplateResultInfo> resultInfo = new List<TestTemplateResultInfo>();
            foreach (var tt in testTemplates)
            {
                TestTemplateResultInfo modelinfo = new TestTemplateResultInfo();
                VmTestTemplate model = new VmTestTemplate();
                model = tt;
                modelinfo.TestTemplateElement = model;
                resultInfo.Add(modelinfo);
            }

            return Ok(resultInfo);
        }
        private List<VmTestTemplate> GetTestTemplate(string languageName)
        {
            List<VmTestTemplate> list = new List<VmTestTemplate>();
            string sqlQueryTestTemplate = $@"select Id, Description,GeneratedCodeStart, GeneratedCodeEnd,Language, Template from TestTemplate where Language = '{languageName}'";

            var testTemplateData = SQLHelper.RunSqlQuery(sqlQueryTestTemplate);

            if (testTemplateData.Count > 0)
            {
                foreach (var item in testTemplateData)
                {
                    VmTestTemplate testTemplate = new VmTestTemplate();
                    //testTemplate.Id = (int)item[0];
                    testTemplate.Description = item[1].ToString();
                    testTemplate.GeneratedCodeStart = item[2].ToString();
                    testTemplate.GeneratedCodeEnd = item[3].ToString();
                    testTemplate.Language = item[4].ToString();
                    testTemplate.Template = item[5].ToString();
                    list.Add(testTemplate);
                }
            }
            return list;
        }
    }
    public class TestTemplateResultInfo
    {
        [JsonPropertyName("TestTemplateElement")]
        public VmTestTemplate TestTemplateElement { get; set; }
    }
    public class VmTestTemplate
    {
        //public int Id { get; set; }
        public string Description { get; set; }
        public string GeneratedCodeStart { get; set; }
        public string GeneratedCodeEnd { get; set; }
        public string Language { get; set; }
        public string Template { get; set; }
    }
}
