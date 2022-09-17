using LMS.Common.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RESTCompilerFunctionsCore.Helpers;

namespace RESTCompilerFunctionsCore.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ValidateCodingProblemController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] RunCodeForValidationInput input)
    {
        try
        {
            VmCodingProblem codingProblem = new VmCodingProblem()
            {
                Instructions = input.Instructions,
                Script = input.Script,
                Solution = input.Solution,
                Language = input.Language,
                Before = input.Before,
                After = input.After,
                ExpectedOutput = input.ExpectedOutput,
                TestCode = input.TestCode,
                ParameterTypes = input.ParameterTypes
            };
            object result = null;//Compiler.RunCodeForValidation(codingProblem, input.VarValuePairs);
            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
