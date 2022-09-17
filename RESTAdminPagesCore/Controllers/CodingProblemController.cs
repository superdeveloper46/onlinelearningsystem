using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using LMS.Common.ViewModels;
using LMSLibrary;
using System.Text.Json.Serialization;

namespace RESTAdminPagesCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodingProblemController : ControllerBase
    {
        // GET: api/CodingProblem/5
        [HttpGet("{Id:int}")]
        public ActionResult<CodingProblemResponseInfo> Get([FromQuery] int Id)
        {
            try
            {
                CodingProblemResponse cp = GetCodingProblem(Id);

                if (cp == null)
                {
                    return BadRequest("Bad Id");
                }

                List<VariableValueResponse> VariableValues = GetVariableValue(cp.Id);
                cp.VariableValues = VariableValues;

                CodingProblemResponseInfo result = new CodingProblemResponseInfo();
                result.CodingProblemResponse = cp;
                
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // GET: api/CodingProblem
        [HttpGet]
        //[HttpGet("{name}/{idCourse}/{idQuarter}/{idInstance}/{idModule}")]
        //[Route("{name}/{idCourse}/{idQuarter}/{idInstance}/{idModule}")]
        public ActionResult<List<CodingProblemInfo>> Get([FromQuery] string name = null, [FromQuery] int idCourse = 0, [FromQuery] int idQuarter = 0, [FromQuery] int idInstance = 0, [FromQuery] int idModule = 0)
        {
            try
            {
                List<CodingProblemInfo> result = new List<CodingProblemInfo>();
                if (idCourse * idQuarter * idInstance * idModule != 0)
                {
                    var codingProblems = GetCourseInstanceCodingProblem(name, idCourse, idQuarter, idInstance, idModule);
                    
                    foreach (var cp in codingProblems)
                    {
                        CodingProblemInfo info = new CodingProblemInfo();
                        CodingProblem codingProblem = new CodingProblem();

                        codingProblem.Id = cp.Id;
                        codingProblem.Title = cp.Title;

                        info.codingProblem = codingProblem;
                        result.Add(info);
                    }
                }
                else
                {
                    string condition = "";
                    if (name != null && name != "")
                    {
                        condition = @" where Title like '%" + name + "%' ";
                    }
                    IQueryable<VmCodingProblem> allCodingProblems = GetCodingProblem(condition).AsQueryable();
                    var codingProblems = allCodingProblems.Select(x => new { Id = x.Id, Title = x.Title }).Distinct().ToList();

                    foreach (var cp in codingProblems)
                    {
                        CodingProblemInfo info = new CodingProblemInfo();
                        CodingProblem codingProblem = new CodingProblem();

                        codingProblem.Id = cp.Id;
                        codingProblem.Title = cp.Title;

                        info.codingProblem = codingProblem;
                        result.Add(info);
                    }
                }
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // POST: api/CodingProblem
        [HttpPost]
        [Route("Post")]
        public ActionResult Post([FromBody] CodingProblemInput codingProblem)
        {
            (bool, string) validateCP = CodingProblemValidation(codingProblem);
            if (validateCP.Item1)
            {
                List<string> errors = new List<string>();
                try
                {
                    VmCodingProblem cp = new VmCodingProblem();
                    cp.Instructions = codingProblem.Instructions;
                    cp.Script = codingProblem.Script;
                    cp.Solution = codingProblem.Solution;
                    cp.Language = codingProblem.Language;
                    cp.Before = codingProblem.Before;
                    cp.After = codingProblem.After;
                    cp.MaxGrade = codingProblem.MaxGrade;
                    cp.Title = codingProblem.Title;
                    cp.Active = codingProblem.Active;
                    cp.Role = codingProblem.Role;
                    cp.ExpectedOutput = codingProblem.ExpectedOutput;
                    cp.TestCode = codingProblem.TestCode;
                    cp.Type = codingProblem.Type;
                    cp.TestCodeForStudent = codingProblem.TestCodeForStudent;
                    cp.Attempts = codingProblem.Attempts;
                    cp.ClassName = "";
                    cp.MethodName = "";
                    cp.ParameterTypes = "";
                    cp.Parameters = "";
                    cp.TestCaseClass = "";
                    var cp1 = InsertCodingProblem(cp);
                    cp.Id = cp1.Id;

                    foreach (var i in codingProblem.VarValuePairs)
                    {
                        VmVariableValue varValues = new VmVariableValue();
                        varValues.VarName = i.Key.Trim();
                        varValues.possibleValues = i.Value.Trim();
                        varValues.CodingProblemId = cp.Id;
                        (bool, string) validation = variableValidation(varValues);

                        if (validation.Item1)
                        {
                            InsertVariableValues(varValues);
                        }
                        else
                        {
                            errors.Add(validation.Item2);
                        }
                    }
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
                if (errors.Count == 0)
                {
                    return Ok("Saved Successfully");
                }
                else
                {
                    string errorString = errors.Aggregate((i, j) => i + ", " + j).ToString();
                    return BadRequest(errorString);
                }
            }
            else
            {
                return BadRequest(validateCP.Item2);
            }
        }

        // PUT: api/CodingProblem/5
        [HttpPut]
        [Route("Put")]
        public ActionResult Put(int id, [FromBody] CodingProblemInput codingProblemUpd)
        {
            (bool, string) validateCP = CodingProblemValidation(codingProblemUpd);
            if (validateCP.Item1)
            {
                List<string> errors = new List<string>();
                VmCodingProblem codingproblem = GetCodingProblemById(id);
                if (codingproblem == null)
                {
                    return BadRequest("Bad Id");
                }
                else
                {
                    try
                    {
                        UpdateCodingProblem(codingProblemUpd, id);
                        foreach (var i in codingProblemUpd.VarValuePairs)
                        {
                            VmVariableValue varValues = new VmVariableValue();
                            varValues.VarName = i.Key.Trim();
                            varValues.possibleValues = i.Value.Trim();
                            varValues.CodingProblemId = id;
                            (bool, string) validation = variableValidation(varValues);
                            if (validation.Item1)
                            {
                                IQueryable<VmVariableValue> variableValue = GetVmVariableValueById(id, i.Key).AsQueryable();
                                if (!variableValue.Any())
                                {
                                    InsertVariableValues(varValues);
                                }
                                else if (variableValue.First().possibleValues != i.Value)
                                {
                                    DeleteVariableValues(variableValue.First().idVariableValue);
                                    InsertVariableValues(varValues);
                                }
                                IQueryable<VmVariableValue> variableValueList = GetVmVariableValueByProblemId(id).AsQueryable();
                                foreach (VmVariableValue vv in variableValueList)
                                {
                                    if (!codingProblemUpd.VarValuePairs.ContainsKey(i.Key))
                                    {
                                        DeleteVariableValues(vv.idVariableValue);
                                    }
                                }
                            }
                            else
                            {
                                errors.Add(validation.Item2);
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }
                if (errors.Count == 0)
                {
                    return Ok("Updated Successfully");
                }
                else
                {
                    string errorString = errors.Aggregate((i, j) => i + ", " + j).ToString();
                    return BadRequest(errorString);
                }
            }
            else
            {
                return BadRequest(validateCP.Item2);
            }
        }

        // DELETE: api/CodingProblem/5
        [HttpDelete]
        [Route("Delete")]
        public void Delete(int id)
        {
        }


        // POST: api/CodingProblem
        [HttpPost]
        public ActionResult Post([FromBody] CodingProblemUpdateRequest RequestData)
        {
            if (RequestData == null) return Ok(new GeneralResponse(-1, "Empty request!"));
            if (RequestData.Method == null) return Ok(new GeneralResponse(-1, "No method has been specified!"));
            if (RequestData.Hash == null) return Ok(new GeneralResponse(-1, "User hash is empty!"));

            // Make sure the sender of the request is the admin
            bool bAuth = AuthHelper.IsAdmin(RequestData.Hash, HttpContext?.Connection?.RemoteIpAddress?.ToString());
            if (bAuth == false) return Ok(new GeneralResponse(-1, "Unauthorized access!\r\n" + AuthHelper.strLastError));

            switch (RequestData.Method)
            {
                case "UpdateInstructions":
                {
                    // Check method-specific parameters
                    if (RequestData.codingProblemId == null || RequestData.codingProblemId <= 0) return Ok(new GeneralResponse(-1, "Invalid CodingProblemId!"));
                    if (RequestData.FieldData == null || RequestData.FieldData.Length == 0) return Ok(new GeneralResponse(0, "Empty field data given!"));

                    // Save data (escape single quoted strings, they conflict with SQL statement)
                    RequestData.FieldData = RequestData.FieldData.Replace("'", "&#39;");
                    RequestData.FieldData = RequestData.FieldData.Replace("\r\n", "<br/>");
                    RequestData.FieldData = RequestData.FieldData.Replace("\n", "<br/>");
                    RequestData.FieldData = RequestData.FieldData.Replace("\r", "<br/>");
                    string sqlQuery = $@"UPDATE [dbo].[CodingProblem] SET [Instructions] = '{RequestData.FieldData}' WHERE [Id] = {RequestData.codingProblemId}";
                    int iRowsAffected = SQLHelper.RunSqlUpdateReturnAffectedRows(sqlQuery);
                    if (iRowsAffected < 1) return Ok(new GeneralResponse(-1, "Could not update data in the database!"));
                    
                    return Ok(new GeneralResponse(1, "Saved successfully."));
                }


                case "UpdateDuedate":
                {
                    // Check method-specific parameters
                    if (RequestData.codingProblemId == null || RequestData.codingProblemId <= 0) return Ok(new GeneralResponse(-1, "Invalid CodingProblemId!"));
                    if (RequestData.courseInstanceId == null || RequestData.courseInstanceId <= 0) return Ok(new GeneralResponse(-1, "Invalid CourseInstanceId!"));
                    if (RequestData.FieldData == null || RequestData.FieldData.Length == 0) return Ok(new GeneralResponse(0, "Empty field data given!"));

                    // Save data 
                    string sqlQuery = $@"UPDATE [dbo].[CourseInstanceCodingProblem] SET [DueDate] = '{RequestData.FieldData}' 
                                        WHERE [CodingProblemId] = {RequestData.codingProblemId}
                                        AND [CourseInstanceId] = {RequestData.courseInstanceId}";
                    int iRowsAffected = SQLHelper.RunSqlUpdateReturnAffectedRows(sqlQuery);
                    if (iRowsAffected < 1) return Ok(new GeneralResponse(-1, "Could not update data in the database!"));
                    
                    return Ok(new GeneralResponse(1, "Saved successfully"));
                }


                case "UpdateTitle":
                {
                    // Check method-specific parameters
                    if (RequestData.codingProblemId == null || RequestData.codingProblemId <= 0) return Ok(new GeneralResponse(-1, "Invalid CodingProblemId!"));
                    if (RequestData.FieldData == null || RequestData.FieldData.Length == 0) return Ok(new GeneralResponse(0, "Empty field data given!"));

                    // Save data 
                    string sqlQuery = $@"UPDATE [dbo].[CodingProblem] SET [Title] = '{RequestData.FieldData}' WHERE [Id] = {RequestData.codingProblemId}";
                    int iRowsAffected = SQLHelper.RunSqlUpdateReturnAffectedRows(sqlQuery);
                    if (iRowsAffected < 1) return Ok(new GeneralResponse(-1, "Could not update data in the database!"));
                    
                    return Ok(new GeneralResponse(1, "Saved successfully"));
                }


                case "UpdateScript":
                {
                    // Check method-specific parameters
                    if (RequestData.codingProblemId == null || RequestData.codingProblemId <= 0) return Ok(new GeneralResponse(-1, "Invalid CodingProblemId!"));
                    if (RequestData.FieldData == null || RequestData.FieldData.Length == 0) return Ok(new GeneralResponse(0, "Empty field data given!"));

                    // Save data
                    string sqlQuery = $@"UPDATE [dbo].[CodingProblem] SET [Script] = '{RequestData.FieldData}' WHERE [Id] = {RequestData.codingProblemId}";
                    int iRowsAffected = SQLHelper.RunSqlUpdateReturnAffectedRows(sqlQuery);
                    if (iRowsAffected < 1) return Ok(new GeneralResponse(-1, "Could not update data in the database!"));

                    return Ok(new GeneralResponse(1, "Saved successfully"));
                }


                case "UpdateMaxAttempts":
                {
                    // Check method-specific parameters
                    if (RequestData.codingProblemId == null || RequestData.codingProblemId <= 0) return Ok(new GeneralResponse(-1, "Invalid CodingProblemId!"));
                    if (RequestData.FieldData == null) return Ok(new GeneralResponse(0, "Empty field data given!"));

                    int iValue;
                    try { // Make sure the value is parsable (not pure string)
                        iValue = int.Parse(RequestData.FieldData);
                    } catch {
                        return Ok(new GeneralResponse(0, "Invalid value!"));
                    }
                    if (iValue < 1) return Ok(new GeneralResponse(0, "Invalid value!"));

                    // Save data
                    string sqlQuery = $@"UPDATE [dbo].[CodingProblem] SET [Attempts] = {RequestData.FieldData} WHERE [Id] = {RequestData.codingProblemId}";
                    int iRowsAffected = SQLHelper.RunSqlUpdateReturnAffectedRows(sqlQuery);
                    if (iRowsAffected < 1) return Ok(new GeneralResponse(-1, "Could not update data in the database!"));

                    return Ok(new GeneralResponse(1, "Saved successfully"));
                }
            }

            return Ok(new GeneralResponse(-1, "Invalid method!"));
        }


        private CodingProblemResponse GetCodingProblem(int Id)
        {
            CodingProblemResponse codingProblem = new CodingProblemResponse();
            string sqlQueryCodingProblem = $@"select Id, Instructions, Script, Solution, ClassName, MethodName, ParameterTypes, Language, TestCaseClass,
                                              Before, After, MaxGrade, Title, Type, Active, Attempts, Role , ExpectedOutput, Parameters, TestCode, 
                                              TestCodeForStudent from CodingProblem where id = {Id}";

            var codingProblemData = SQLHelper.RunSqlQuery(sqlQueryCodingProblem);

            if (codingProblemData.Count > 0)
            {
                List<object> cp = codingProblemData[0];

                codingProblem.Id = (int)cp[0];
                codingProblem.Instructions = cp[1].ToString();
                codingProblem.Script = cp[2].ToString();
                codingProblem.Solution = cp[3].ToString();
                codingProblem.ClassName = cp[4].ToString();
                codingProblem.MethodName = cp[5].ToString();
                codingProblem.ParameterTypes = cp[6].ToString();
                codingProblem.Language = cp[7].ToString();
                codingProblem.TestCaseClass = cp[8].ToString();
                codingProblem.Before = cp[9].ToString();
                codingProblem.After = cp[10].ToString();
                codingProblem.MaxGrade = (int)cp[11];
                codingProblem.Title = cp[12].ToString();
                codingProblem.Type = cp[13].ToString();
                codingProblem.Active = (bool)cp[14];
                codingProblem.Attempts = (int)cp[15];
                codingProblem.Role = (int)cp[16];
                codingProblem.ExpectedOutput = cp[17].ToString();
                codingProblem.Parameters = cp[18].ToString();
                codingProblem.TestCode = cp[19].ToString();
                codingProblem.TestCodeForStudent = cp[20].ToString();
            }
            return codingProblem;
        }
        private List<VariableValueResponse> GetVariableValue(int Id)
        {
            List<VariableValueResponse> list = new List<VariableValueResponse>();
            string sqlQueryVmVariableValue = $@"select IdVariableValue, CodingProblemId, VarName, PossibleValues from VariableValue where CodingProblemId = {Id} order by PossibleValues";

            var variableValueData = SQLHelper.RunSqlQuery(sqlQueryVmVariableValue);

            if (variableValueData.Count > 0)
            {
                foreach (var item in variableValueData)
                {
                    VariableValueResponse vv = new VariableValueResponse();
                    vv.idVariableValue = (int)item[0];
                    vv.CodingProblemId = (int)item[1];
                    vv.VarName = item[2].ToString();
                    vv.possibleValues = item[3].ToString();

                    list.Add(vv);
                }
            }
            return list;
        }
        private List<CodingProblem> GetCourseInstanceCodingProblem(string name, int idCourse, int idQuarter, int idInstance, int idModule)
        {
            string sqlConditionName = string.Empty;
            string sqlConditionidCourse = string.Empty;
            string sqlConditionidQuarter = string.Empty;
            string sqlConditionidInstance = string.Empty;
            string sqlConditionidModule = string.Empty;

            //IQueryable<CourseInstanceCodingProblem> filteredCodingProblems = db.CourseInstanceCodingProblems;
            //List<VmCourseInstanceCodingProblem> filteredCodingProblems = new List<VmCourseInstanceCodingProblem>();
            List<CodingProblem> list = new List<CodingProblem>();

            if (name != null && name != "")
                sqlConditionName = @" and cp.Title like '%" + name + "%' ";
            //filteredCodingProblems = filteredCodingProblems.Where(x => x.CodingProblem.Title.Contains(name)).ToList();
            if (idCourse > 0)
                sqlConditionidCourse = $@" and ci.CourseId = {idCourse}";
            //filteredCodingProblems = filteredCodingProblems.Where(x => x.CourseInstance.CourseId == idCourse).ToList();
            if (idQuarter > 0)
                sqlConditionidQuarter = $@" and ci.QuarterId = {idQuarter}";
            //filteredCodingProblems = filteredCodingProblems.Where(x => x.CourseInstance.QuarterId == idQuarter).ToList();
            if (idInstance > 0)
                sqlConditionidInstance = $@" and cicp.CourseInstanceId = {idInstance}";
            //filteredCodingProblems = filteredCodingProblems.Where(x => x.CourseInstanceId == idInstance).ToList();
            if (idModule > 0)
                sqlConditionidModule = $@" and cicp.ModuleObjectiveId = {idModule}";
            //filteredCodingProblems = filteredCodingProblems.Where(x => x.ModuleObjectiveId == idModule).ToList();

            string sqlQueryCourseInstanceCodingProblem = $@"select Distinct cicp.CodingProblemId, cp.Title
                                                            from CourseInstanceCodingProblem cicp 
                                                            inner join CodingProblem cp on cp.Id = cicp.CodingProblemId
		                                                    inner join CourseInstance ci on ci.Id =  cicp.CourseInstanceId
                                                            where cicp.Active = 1 {sqlConditionName} {sqlConditionidCourse} {sqlConditionidQuarter} 
                                                            {sqlConditionidInstance} {sqlConditionidModule}";

            var courseInstanceCodingProblemData = SQLHelper.RunSqlQuery(sqlQueryCourseInstanceCodingProblem);

            if (courseInstanceCodingProblemData.Count > 0)
            {
                foreach (var item in courseInstanceCodingProblemData)
                {
                    CodingProblem codingProblem = new CodingProblem();
                    codingProblem.Id = (int)item[0];
                    codingProblem.Title = (string)item[1];
                    list.Add(codingProblem);
                }
                //list = list.Distinct().ToList();
            }
            return list;
        }
        private List<VmCourseInstanceCodingProblem> GetCourseInstanceCodingProblemV1()
        {
            string sqlQueryCourseInstanceCodingProblem = $@"select cicp.CourseInstanceId, cicp.ModuleObjectiveId, cicp.CodingProblemId, cicp.MaxGrade, cicp.Active, cicp.DueDate, cp.Title , ci.CourseId, ci.QuarterId
                                                    from CourseInstanceCodingProblem cicp 
                                                    inner join CodingProblem cp on cp.Id = cicp.CodingProblemId
		                                            inner join CourseInstance ci on ci.Id =  cicp.CourseInstanceId";

            List<VmCourseInstanceCodingProblem> list = new List<VmCourseInstanceCodingProblem>();

            var courseInstanceCodingProblemData = SQLHelper.RunSqlQuery(sqlQueryCourseInstanceCodingProblem);

            if (courseInstanceCodingProblemData.Count > 0)
            {
                foreach (var item in courseInstanceCodingProblemData)
                {
                    VmCourseInstanceCodingProblem vv = new VmCourseInstanceCodingProblem();
                    vv.CourseInstanceId = (int)item[0];
                    vv.ModuleObjectiveId = (int)item[1];
                    vv.CodingProblemId = (int)item[2];
                    vv.MaxGrade = (int)item[3];
                    vv.Active = (bool)item[4];
                    vv.DueDate = (DateTime)item[5];

                    VmCodingProblem cp = new VmCodingProblem();
                    cp.Id = vv.CodingProblemId;
                    cp.Title = item[6].ToString();
                    vv.CodingProblem = cp;

                    VmCourseInstance ci = new VmCourseInstance();
                    ci.Id = vv.CourseInstanceId;
                    ci.CourseId = (int)item[7];
                    ci.QuarterId = (int)item[8];
                    vv.CourseInstance = ci;

                    list.Add(vv);
                }
            }
            return list;
        }
        private List<VmCodingProblem> GetCodingProblem(string condition)
        {
            List<VmCodingProblem> list = new List<VmCodingProblem>();
            string sqlQueryCourseInstanceCodingProblem = $@"select Id,Title from CodingProblem
{condition}";

            var courseInstanceCodingProblemData = SQLHelper.RunSqlQuery(sqlQueryCourseInstanceCodingProblem);

            if (courseInstanceCodingProblemData.Count > 0)
            {
                foreach (var item in courseInstanceCodingProblemData)
                {
                    VmCodingProblem cp = new VmCodingProblem();
                    cp.Id = (int)item[0];
                    cp.Title = item[1].ToString();

                    list.Add(cp);
                }
            }
            return list;
        }
        private VmCodingProblem GetCodingProblemById(int problemId)
        {
            VmCodingProblem vmCodingProblem = null;
            string sqlQueryCourseInstanceCodingProblem = $@"select Id,Title from CodingProblem where Id = {problemId}";

            var courseInstanceCodingProblemData = SQLHelper.RunSqlQuery(sqlQueryCourseInstanceCodingProblem);

            if (courseInstanceCodingProblemData.Count > 0)
            {
                List<object> st = courseInstanceCodingProblemData[0];
                vmCodingProblem = new VmCodingProblem
                {
                    Id = (int)st[0]
                };
            }

            return vmCodingProblem;
        }
        private VmCodingProblem InsertCodingProblem(VmCodingProblem vmCodingProblem)
        {
            string sqlQueryQuarter = $@"exec CreateCodingProblem '{vmCodingProblem.Instructions}',
                                                                 '{vmCodingProblem.Script}',
                                                                 '{vmCodingProblem.Solution}' ,                                                                 
                                                                 '{vmCodingProblem.ClassName}' ,
                                                                 '{vmCodingProblem.MethodName}' ,
                                                                 '{vmCodingProblem.ParameterTypes}' ,
                                                                 '{vmCodingProblem.Language}' ,
                                                                 '{vmCodingProblem.TestCaseClass}' ,
                                                                 '{vmCodingProblem.Before}' ,
                                                                 '{vmCodingProblem.After}' ,
                                                                  {vmCodingProblem.MaxGrade} ,
                                                                 '{vmCodingProblem.Title}' ,
                                                                 '{vmCodingProblem.Type}' ,
                                                                  {vmCodingProblem.Attempts} ,
                                                                  {vmCodingProblem.Active} ,
                                                                  {vmCodingProblem.Role} ,
                                                                 '{vmCodingProblem.ExpectedOutput}' ,
                                                                 '{vmCodingProblem.Parameters}' ,
                                                                 '{vmCodingProblem.TestCode}' ,
                                                                 '{vmCodingProblem.TestCodeForStudent}'
                                                                 ";
            var codingProblem = SQLHelper.RunSqlQuery(sqlQueryQuarter);
            VmCodingProblem codeHint = null;
            if (codingProblem.Count > 0)
            {
                List<object> st = codingProblem[0];
                codeHint = new VmCodingProblem
                {
                    Id = (int)st[16]
                };
            }
            return codeHint;
        }
        private bool InsertVariableValues(VmVariableValue vmVariableValue)
        {
            string sqlQueryStudent = $@"INSERT INTO VariableValue (CodingProblemId, VarName, possibleValues)
                                            VALUES ({vmVariableValue.CodingProblemId}, '{vmVariableValue.VarName}', '{vmVariableValue.possibleValues}')";
            bool isSucess = SQLHelper.RunSqlUpdate(sqlQueryStudent);
            return isSucess;
        }
        private bool UpdateCodingProblem(CodingProblemInput codingProblemUpd, int Id)
        {
            int active = 1;
            if (!codingProblemUpd.Active)
                active = 0;
            string sqlQueryStudent = $@"UPDATE [dbo].[CodingProblem]
                                       SET [Instructions] = '{codingProblemUpd.Instructions}'
                                          ,[Script] = '{codingProblemUpd.Script}'
                                          ,[Solution] = '{codingProblemUpd.Solution}'
                                          ,[Language] = '{codingProblemUpd.Language}'
                                          ,[Before] = '{codingProblemUpd.Before}'
                                          ,[After] = '{codingProblemUpd.After}'
                                          ,[MaxGrade] = {codingProblemUpd.MaxGrade}
                                          ,[Title] = '{codingProblemUpd.Title}'
                                          ,[Attempts] = '{codingProblemUpd.Attempts}'
                                          ,[Active] = {active}
                                          ,[Role] = {codingProblemUpd.Role}
                                          ,[ExpectedOutput] = '{codingProblemUpd.ExpectedOutput}'
                                          ,[TestCode] = '{codingProblemUpd.TestCode}'
                                          ,[TestCodeForStudent] = '{codingProblemUpd.TestCodeForStudent}'
                                     WHERE Id = {Id}";
            bool isSucess = SQLHelper.RunSqlUpdate(sqlQueryStudent);
            return isSucess;
        }
        private List<VmVariableValue> GetVmVariableValueById(int problemId, string varName)
        {
            List<VmVariableValue> vmCodingProblems = new List<VmVariableValue>();
            string sqlQueryCourseInstanceCodingProblem = $@"select * from [VariableValue] where CodingProblemId = {problemId} and VarName = '{varName}'";

            var ob = SQLHelper.RunSqlQuery(sqlQueryCourseInstanceCodingProblem);

            if (ob.Count > 0)
            {
                foreach (var item in ob)
                {
                    var vmCodingProblem = new VmVariableValue
                    {
                        idVariableValue = (int)item[0],
                        CodingProblemId = (int)item[1]
                    };
                    vmCodingProblems.Add(vmCodingProblem);
                }
            }
            return vmCodingProblems;
        }
        private bool DeleteVariableValues(int id)
        {
            string sqlQueryStudent = $@"delete from [VariableValue] where idVariableValue = {id}";
            bool isSucess = SQLHelper.RunSqlUpdate(sqlQueryStudent);
            return isSucess;
        }
        private List<VmVariableValue> GetVmVariableValueByProblemId(int problemId)
        {
            List<VmVariableValue> vmCodingProblems = new List<VmVariableValue>();
            string sqlQueryCourseInstanceCodingProblem = $@"select * from [VariableValue] where CodingProblemId = {problemId} ";

            var ob = SQLHelper.RunSqlQuery(sqlQueryCourseInstanceCodingProblem);

            if (ob.Count > 0)
            {
                foreach (var item in ob)
                {
                    var vmCodingProblem = new VmVariableValue
                    {
                        idVariableValue = (int)item[0],
                        CodingProblemId = (int)item[1]
                    };
                    vmCodingProblems.Add(vmCodingProblem);
                }
            }
            return vmCodingProblems;
        }
        protected (bool, string) CodingProblemValidation(CodingProblemInput codingProblem)
        {
            bool result = true;
            string fieldName = "Sorry! Operation has been failed. Required Fields: ";

            if (string.IsNullOrWhiteSpace(codingProblem.Type))
            {
                fieldName += " Type -";
                result = false;
            }

            if (string.IsNullOrWhiteSpace(codingProblem.Language))
            {
                fieldName += " Language -";
                result = false;
            }

            if (string.IsNullOrWhiteSpace(codingProblem.MaxGrade.ToString()))
            {
                fieldName += " Max Grade -";
                result = false;
            }

            if (string.IsNullOrWhiteSpace(codingProblem.Title))
            {
                fieldName += " Title -";
                result = false;
            }

            if (string.IsNullOrWhiteSpace(codingProblem.Attempts.ToString()))
            {
                fieldName += " Attempts -";
                result = false;
            }

            if (string.IsNullOrWhiteSpace(codingProblem.Role.ToString()))
            {
                fieldName += " Role -";
                result = false;
            }

            if (!result)
            {
                return (result, fieldName);
            }
            else
            {
                return (result, "");
            }
        }
        protected (bool, string) variableValidation(VmVariableValue vv)
        {
            string msg = "";

            if (vv.VarName != "" && vv.possibleValues != "")
            {
                string pattern = @".*\$.*|.*\{.*|.*\}.*|^studentid$"; //Not allow variables with $,{,} and "studentid"
                bool nameNotValid = Regex.IsMatch(vv.VarName, pattern, RegexOptions.IgnoreCase);
                if (nameNotValid)
                {
                    msg = "Name " + vv.VarName + " is not valid";
                    return (false, msg);
                }
                else
                {
                    string[] possiblesValues = Regex.Split(vv.possibleValues, @"(?<!\/)\,(?![^[]*]|[^{]*})");
                    if (Regex.IsMatch(vv.possibleValues, "\\["))
                    {
                        foreach (String possiblesValuesItem in possiblesValues)
                        {
                            bool isArray = Regex.IsMatch(possiblesValuesItem, @"^\[([\w]+((,[\w]*)+|([\w]*)+)\]$)|^\{([\w]+((,[\w]*)+|([\w]*)+)\}$)");
                            if (!isArray)
                            {
                                msg = "The variable named " + vv.VarName + " has a wrongly defined " + possiblesValuesItem;
                                return (false, msg);
                            }
                        }
                        return (true, msg);
                    }
                    else
                    {
                        foreach (String possiblesValuesItem in possiblesValues)
                        {
                            pattern = "\\.\\.";
                            bool isRange = Regex.IsMatch(possiblesValuesItem, pattern);
                            if (isRange)
                            {
                                string[] range = possiblesValuesItem.Trim().Split(new[] { ".." }, StringSplitOptions.RemoveEmptyEntries);
                                if (range.Count() > 1)
                                {
                                    pattern = "\\:";
                                    bool haveColon = Regex.IsMatch(range[1], pattern);
                                    string[] ColInRange = range[1].Trim().Split(new[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
                                    if (haveColon && ColInRange.Count() != 2)
                                    {
                                        msg = "The variable named " + vv.VarName.Trim() + " has a wrongly defined range";
                                        return (false, msg);
                                    }
                                }
                                else
                                {
                                    msg = "The variable named " + vv.VarName.Trim() + " has a wrongly defined range";
                                    return (false, msg);
                                }
                            }
                        }
                        return (true, msg);
                    }
                }
            }
            else if (vv.VarName == "" && vv.possibleValues == "")
            {
                msg = "Variable is empty";
                return (false, msg);
            }
            else if (vv.VarName != "" && vv.possibleValues == "")
            {
                msg = "Possible values is required";
                return (false, msg);
            }
            else if (vv.VarName == "" && vv.possibleValues != "")
            {
                msg = "Variable name is required";
                return (false, msg);
            }
            else
            {
                return (true, msg);
            }
        }
    }

    public class CodingProblemInfo
    {
        [JsonPropertyName("CodingProblem")]
        public CodingProblem codingProblem { get; set; }
    }
    public class CodingProblem
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("Title")]
        public string Title { get; set; }
    }
    public class CodingProblemInput
    {
        public string Instructions { get; set; }
        public string Language { get; set; }
        public string Script { get; set; }
        public string Solution { get; set; }
        public string Before { get; set; }
        public string After { get; set; }
        public string ExpectedOutput { get; set; }
        public string TestCode { get; set; }
        public string TestCodeForStudent { get; set; }
        public string ParameterTypes { get; set; }
        public int MaxGrade { get; set; }
        public string Title { get; set; }
        public bool Active { get; set; }
        public string Type { get; set; }
        public int Attempts { get; set; }
        public int Role { get; set; }
        public Dictionary<string, string> VarValuePairs { get; set; }
    }
    public class CodingProblemResponse
    {
        [JsonPropertyName("Instructions")]
        public string Instructions { get; set; }

        [JsonPropertyName("Script")]
        public string Script { get; set; }

        [JsonPropertyName("Solution")]
        public string Solution { get; set; }

        [JsonPropertyName("ClassName")]
        public string ClassName { get; set; }

        [JsonPropertyName("MethodName")]
        public string MethodName { get; set; }

        [JsonPropertyName("ParameterTypes")]
        public string ParameterTypes { get; set; }

        [JsonPropertyName("Language")]
        public string Language { get; set; }

        [JsonPropertyName("TestCaseClass")]
        public string TestCaseClass { get; set; }

        [JsonPropertyName("Before")]
        public string Before { get; set; }

        [JsonPropertyName("After")]
        public string After { get; set; }

        [JsonPropertyName("MaxGrade")]
        public int MaxGrade { get; set; }

        [JsonPropertyName("Title")]
        public string Title { get; set; }

        [JsonPropertyName("Type")]
        public string Type { get; set; }

        [JsonPropertyName("Attempts")]
        public int Attempts { get; set; }

        [JsonPropertyName("Active")]
        public bool Active { get; set; }

        [JsonPropertyName("Role")]
        public int Role { get; set; }

        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("ExpectedOutput")]
        public string ExpectedOutput { get; set; }

        [JsonPropertyName("Parameters")]
        public string Parameters { get; set; }

        [JsonPropertyName("TestCode")]
        public string TestCode { get; set; }

        [JsonPropertyName("TestCodeForStudent")]
        public string TestCodeForStudent { get; set; }

        [JsonPropertyName("VariableValues")]
        public virtual ICollection<VariableValueResponse> VariableValues { get; set; } = new HashSet<VariableValueResponse>();
    }
    public class VariableValueResponse
    {
        [JsonPropertyName("IdVariableValue")]
        public int idVariableValue { get; set; }

        [JsonPropertyName("CodingProblem")]
        public int CodingProblemId { get; set; }

        [JsonPropertyName("Name")]
        public string VarName { get; set; }

        [JsonPropertyName("PossibleValues")]
        public string possibleValues { get; set; }
    }
    public class CodingProblemResponseInfo
    {
        [JsonPropertyName("CodingProblem")]
        public CodingProblemResponse CodingProblemResponse { get; set; }
    }

    public class CodingProblemUpdateRequest
    {
        public string? Hash { get; set; }
        public string? Method { get; set; }
        public string? FieldData { get; set; }
        public int? codingProblemId { get; set; }
        public int? courseInstanceId { get; set; }
    }
}
