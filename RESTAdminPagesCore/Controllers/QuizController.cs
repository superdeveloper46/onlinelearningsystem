using LMSLibrary;
using Microsoft.AspNetCore.Mvc;

namespace RESTAdminPagesCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        // POST: api/Quiz
        [HttpPost]
        public ActionResult Post([FromBody] QuizUpdateRequest RequestData)
        {
            if (RequestData == null) return Ok(new GeneralResponse(-1, "Empty request!"));
            if (RequestData.Method == null) return Ok(new GeneralResponse(-1, "No method has been specified!"));
            if (RequestData.Hash == null) return Ok(new GeneralResponse(-1, "User hash is empty!"));

            // Make sure the sender of the request is the admin
            bool bAuth = AuthHelper.IsAdmin(RequestData.Hash, HttpContext?.Connection?.RemoteIpAddress?.ToString());
            if (bAuth == false) return Ok(new GeneralResponse(-1, "Unauthorized access!\r\n" + AuthHelper.strLastError));

            switch (RequestData.Method)
            {
                case "EditQuestion":
                {
                    // Check method-specific parameters
                    if (RequestData.QuestionId == null || RequestData.QuestionId <= 0) return Ok(new GeneralResponse(-1, "Invalid QuestionId!"));
                    if (RequestData.FieldData == null || RequestData.FieldData.Count == 0) return Ok(new GeneralResponse(0, "Empty field data given!"));

                    // Save data
                    string sqlQuery = $@"UPDATE [dbo].[QuizQuestion] SET ";
                    for (int i = 0; i < RequestData.FieldData.Count; i++)
                    {
                        OneField Field = RequestData.FieldData[i];
                        sqlQuery += $@"[{Field.Name}] = '{Field.Value}'";
                        if (i < (RequestData.FieldData.Count - 1)) sqlQuery += ", ";
                    }
                    sqlQuery += $@" WHERE [Id] = {RequestData.QuestionId}";

                    int iRowsAffected = SQLHelper.RunSqlUpdateReturnAffectedRows(sqlQuery);
                    if (iRowsAffected < 1) return Ok(new GeneralResponse(-1, "Could not update data in the database!"));

                    return Ok(new GeneralResponse(1, "Saved successfully."));
                }
            }

            return Ok(new GeneralResponse(-1, "Invalid method!"));
        }
    }


    public class OneField
    {
        public string? Name { get; set; }
        public string? Value { get; set; }
    }

    public class QuizUpdateRequest
    {
        public string? Hash { get; set; }
        public string? Method { get; set; }
        public List<OneField>? FieldData { get; set; }
        public int? QuestionId { get; set; }
    }
}
