using Microsoft.AspNetCore.Mvc;

namespace RESTModelFunctionsCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodingProblemController : ControllerBase
    {

        [HttpPost]
        public IActionResult Post([FromBody] CodingProblemInput input)
        {
            object result = AssignmentController.GetCodingProblem(input.Hash, input.CodingProblemId, input.CourseInstanceId);
            //HttpRunCodeRequest(input);// Compiler.GetCodingProblem(input.Hash, input.CodingProblemId, input.CourseInstanceId);
            return Ok(result);
        }

        //public static object HttpRunCodeRequest(CodingProblemInput input)
        //{
        //    using (var client = new HttpClient())
        //    {

        //        client.BaseAddress = new Uri("https://localhost:44396/api/");
        //        var jsonStringInput = Newtonsoft.Json.JsonConvert.SerializeObject(input);
        //        HttpContent httpContent = new StringContent(jsonStringInput, System.Text.Encoding.UTF8, "application/json");
        //        var response = client.PostAsync("CodingProblem/Post", httpContent).Result;
        //        if (response.IsSuccessStatusCode)
        //        {
        //            var jsonResultString = response.Content.ReadAsStringAsync();
        //            jsonResultString.Wait();
        //            var executionResult = Newtonsoft.Json.JsonConvert.DeserializeObject<Object>(jsonResultString.Result);
        //            return executionResult;
        //        }
        //        else
        //            return null;
        //    }
        //}

    }
    public class CodingProblemInput
    {
        public string Hash { get; set; }
        public int CodingProblemId { get; set; }
        public int CourseInstanceId { get; set; }
    }
}
