using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RESTCompilerFunctionsCore.Helpers;
//using Syncfusion.XlsIO;


namespace RESTCompilerFunctionsCore.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CompilerApiController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] LMS.Common.Infos.CompilerRunApiInput compilerApiInput)
    {
        object result = Compiler.CompilerRunCode(compilerApiInput);
        return Ok(result);
    }
}
