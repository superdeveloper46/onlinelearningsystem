using CompilerFunctions;
using System.Web.Http;
using System.Web.Http.Cors;

namespace RESTCompilerFunctions.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CompilerValidationController : ApiController
    {
        public class Input
        {
            public string Hash { get; set; }
            public int CodingProblemId { get; set; }
            public int CourseInstanceId { get; set; }
        }
        

        [HttpPost]
        public IHttpActionResult Post([FromBody] LMS.Common.Infos.CompilerApiInput compilerApiInput)
        {
            object result = Compiler.CompilerRunCodeForValidation(compilerApiInput);
            return Ok(result);
        }
        
    }
}
