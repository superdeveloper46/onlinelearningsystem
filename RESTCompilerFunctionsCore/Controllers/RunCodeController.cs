using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RESTCompilerFunctionsCore.Helpers;

namespace RESTCompilerFunctionsCore.Controllers;
[Route("api/[controller]")]
[ApiController]
public class RunCodeController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] Input input)
    {

        object result = null;//Compiler.RunCode(input.Hash, input.CodingProblemId, input.CourseInstanceId, input.Code, input.CodeStructurePoints);
        return Ok(result);
    }
}
