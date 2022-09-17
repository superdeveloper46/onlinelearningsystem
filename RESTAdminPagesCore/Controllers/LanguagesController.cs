using System.Text.Json.Serialization;
using System.Xml.Linq;
//using EFModel;
using LMS.Common.ViewModels;
using LMSLibrary;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace RESTAdminPagesCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguagesController : ControllerBase
    {
        [HttpGet]
        //[Route("api/Languages")]
        public ActionResult<List<LanguageResult>> GetLanguages()
        {
            try
            {
                List<VmLanguage> languageList = GetLanguage();
                var languages = languageList.Select(x => new { Id = x.Id, Title = x.Name }).ToList();
                
                List<LanguageResult> resultLaguage = new List<LanguageResult>();
                foreach (var language in languages)
                {
                    LanguageResult model = new LanguageResult();
                    
                    Language lang = new Language();
                    lang.Id = language.Title;
                    lang.Title = language.Title;

                    model.Language = lang;
                    resultLaguage.Add(model);
                }

                return Ok(resultLaguage);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{name}")]
        public ActionResult<LanguageInfoResult> GetLanguage(string name)
        {
            
            try
            {
                //string name = name1.ToString();
                VmLanguage language = GetLanguageByName(name);
                if (language == null)
                {
                    return NotFound();
                }

                LanguageInfoResult result = new LanguageInfoResult();
                
                LanguageInfo lang = new LanguageInfo
                {
                    Id = language.Id,
                    Title = language.Name,
                    CodeStart = language.CodeStart,
                    CodeEnd = language.CodeEnd,
                };
                result.Language = lang;

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        private List<VmLanguage> GetLanguage()
        {
            List<VmLanguage> list = new List<VmLanguage>();
            string sqlQueryLanguage = $@"select id, name, CodeStart, CodeEnd from language";

            var languageData = SQLHelper.RunSqlQuery(sqlQueryLanguage);

            if (languageData.Count > 0)
            {
                foreach (var item in languageData)
                {
                    VmLanguage language = new VmLanguage();
                    language.Id = (int)item[0];
                    language.Name = item[1].ToString();
                    language.CodeStart = item[2].ToString();
                    language.CodeEnd = item[3].ToString();
                    list.Add(language);
                }
            }
            return list;
        }
        private VmLanguage GetLanguageByName(string name)
        {
            VmLanguage language = new VmLanguage();
            string sqlQueryLanguage = $@"select id, name, CodeStart, CodeEnd from language where name = '{name}'";

            var languageData = SQLHelper.RunSqlQuery(sqlQueryLanguage);

            if (languageData.Count > 0)
            {
                List<object> lg = languageData[0];
                language.Id = (int)lg[0];
                language.Name = lg[1].ToString();
                language.CodeStart = lg[2].ToString();
                language.CodeEnd = lg[3].ToString();
            }
            return language;
        }
    }
    public class LanguageResult
    {
        [JsonPropertyName("Language")]
        public Language Language { get; set; }
    }
    public class Language
    {
        [JsonPropertyName("Id")]
        public string Id { get; set; }

        [JsonPropertyName("Title")]
        public string Title { get; set; }
    }

    public class LanguageInfoResult
    {
        [JsonPropertyName("Language")]
        public LanguageInfo Language { get; set; }
    }
    public class LanguageInfo
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("Title")]
        public string Title { get; set; }

        [JsonPropertyName("CodeStart")]
        public string CodeStart { get; set; }

        [JsonPropertyName("CodeEnd")]
        public string CodeEnd { get; set; }
    }
}
