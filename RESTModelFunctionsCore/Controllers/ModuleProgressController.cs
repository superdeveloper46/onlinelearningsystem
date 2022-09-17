using LMS.Common.ViewModels;
using LMSLibrary;
using Microsoft.AspNetCore.Mvc;

namespace RESTModelFunctionsCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleProgressController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post()
        {
            return Ok();
        }
    }
}
