using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RESTCompilerFunctionsCore.Helpers;

namespace RESTCompilerFunctionsCore.Controllers;
[Route("api/[controller]")]
[ApiController]
public class GetCodingProblemController : ControllerBase
{
    [HttpPost]
    [Route("PostRunCodeForValidation")]
    public IActionResult PostRunCodeForValidation(LMS.Common.Infos.CompilerApiInput compilerApiInput)
    {
        object result = Compiler.CompilerRunCodeForValidation(compilerApiInput);
        return Ok(result);
    }
}
