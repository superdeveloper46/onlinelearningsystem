using Microsoft.AspNetCore.Mvc;
using RESTCompilerFunctionsCore.Helpers;

namespace RESTCompilerFunctionsCore.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CompilerValidationController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] LMS.Common.Infos.CompilerApiInput compilerApiInput)
    {
        object result = Compiler.CompilerRunCodeForValidation(compilerApiInput);
        return Ok(result);
    }
}
