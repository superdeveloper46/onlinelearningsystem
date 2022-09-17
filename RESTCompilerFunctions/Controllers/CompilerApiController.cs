using CompilerFunctions;
using System.Web.Http;
using System.Web.Http.Cors;

namespace RESTCompilerFunctions.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CompilerApiController : ApiController
    {
        public class Input
        {
            public string Hash { get; set; }
            public int CodingProblemId { get; set; }
            public int CourseInstanceId { get; set; }
        }
        // POST api/GetCodingProblem
        //public IHttpActionResult Post([FromBody] Input input)
        //{
        //    object result = Compiler.GetCodingProblem(input.Hash, input.CodingProblemId, input.CourseInstanceId);
        //    return Ok(result);
        //}

        [HttpPost]
        //[Route("PostRunCode")]
        public IHttpActionResult Post([FromBody] LMS.Common.Infos.CompilerRunApiInput compilerApiInput)
        {
            object result = Compiler.CompilerRunCode(compilerApiInput);
            return Ok(result);
        }

        //[HttpPost]
        //[ActionName("PostRunCodeForValidation")]
        //public IHttpActionResult PostRunCodeForValidation(LMS.Common.Infos.CompilerApiInput compilerApiInput)
        //{
        //    object result = Compiler.CompilerRunCodeForValidation(compilerApiInput);
        //    return Ok(result);
        //}
        //[HttpPost]
        //[ActionName("PostRunCode")]
        //public IHttpActionResult PostRunCode(LMS.Common.Infos.CompilerRunApiInput compilerApiInput)
        //{
        //    object result = Compiler.CompilerRunCode(compilerApiInput);
        //    return Ok(result);
        //}
    }
}
