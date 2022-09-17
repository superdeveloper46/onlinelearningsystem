using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMS.Common.Infos;
using LMSLibrary;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Moq;
using RESTModelFunctionsCore.Helper;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class AssignmentController_Tests
    {
        public Mock<IHttpContextAccessor> httpContext;
        public IHttpContextAccessor httpContextObject;
        public AssignmentController_Tests()
        {            
            var features = new FeatureCollection();

            var url = new HttpRequestFeature();
            features.Set<IHttpRequestFeature>(url);

            httpContext = new Mock<IHttpContextAccessor>();
            var context = new DefaultHttpContext(features);
            httpContext.Setup(a => a.HttpContext).Returns(context);
            httpContextObject = httpContext.Object;
        }

        [TestMethod]
        [ExpectedException(typeof(NullReferenceException))]
        public void GetAssignmentWithInvalidHashAndId_ThrowsNullReferenceException()
        {
            var controller = new AssignmentController(httpContextObject);
            controller.RunCode(new Input { CodingProblemId = -1, Hash = "invalidhash" });
            
        }

        [TestMethod]
        public void GetAssignmentWithValidHashAndIdHavingInvalidSolution_ThrowsException()
        {
            httpContextObject.HttpContext.Request.Host = new HostString("localhost");

            var controller = new AssignmentController(httpContextObject);
            Assert.ThrowsException<Exception>(() => controller.RunCode(new Input { CodingProblemId = 341, Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", Code = "Assert.AreEqual(a, b);", CourseInstanceId = 115 }));

            DeleteInsertedSubmission(708, 341);
        }

        [TestMethod]
        public void AssignmentValidationWithoutSolution_ReturnsBadRequest()
        {
            var controller = new AssignmentController(httpContextObject);
            var response = controller.RunCodeForValidationAPI(new RunCodeForValidationInput { });

            var okResponse = response as BadRequestObjectResult;

            var resultValue = (string)okResponse.Value;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue, "The problem solution is needed in order to verify it.");
        }

        [TestMethod]
        public void AssignmentValidationWithSolution_ReturnsOkResponse()
        {
            httpContextObject.HttpContext.Request.Host = new HostString("localhost");

            var instructions = @"<p>There is a number N (i.e. N = 3).</p><p>I create an array from -N to N (i.e. {-3, -2, -1, 0, 1, 2, 3})</p><p>I randomly remove a number from the array&nbsp;(i.e. {-3, -2, 0, 1, 2, 3}, removed -1)</p><p>I shuffle the Array (i.e. {-2, 0, 2, 3, -3, 1})</p><p>Write a function</p><p>&nbsp; &nbsp; public int FindMissing(int[] arr)</p><p>That takes a shuffled Array using the steps described above and identifies and returns the missing number in the array.&nbsp;</p><p>N can be any number including 0 and the missing number can be any number between -N and N, the example above is just an example. When you submit the code the system will check it against a set of random inputs.</p>";
            var script = @"using Microsoft.VisualStudio.TestTools.UnitTesting;
                using System;
                using System.Collections.Generic;

                public partial class MissingNumber
                {
                    public int FindMissing(int[] arr)
                    {
                        // Your code starts here
                        int ${{studentid}};
                        int ${{a,1}};
                        int ${total} = ${{a,2}} + ${{b}};
                        return ${{total}};

                        // Your code ends here
                    }
                }";
            var solution = @"public partial class MissingNumberSol
                {
                    public int FindMissing(int[] arr)
                    {
                        // Your code starts here
                        int res = 0;
                        int ${{studentid}};
                        int ${{a,1}};
                        int ${total} = ${{a,2}} + ${{b}};
                        return ${{total}};
                        // Your code ends here
                    }
                }";
            var className = @"[TestClass]
            public class UnitTest1
            {
                [TestMethod]
                public void TestMethod1()
                {
                    Assert.AreEqual(2, Solution.MissingNumber(new int[] { 3, 4, 1 }));
                }
                [TestMethod]
                public void TestMethod2()
                {
                    Assert.AreEqual(8, Solution.MissingNumber(new int[] { 9, 6, 4, 2, 3, 5, 7, 10, 1 }));
                }
                [TestMethod]
                public void TestMethod3()
                {
                    Assert.AreEqual(1, Solution.MissingNumber(new int[] {  }));
                }
                [TestMethod]
                public void TestMethod4()
                {
                    Assert.AreEqual(1, Solution.MissingNumber(new int[] { 2 }));
                }
                [TestMethod]
                public void TestMethod5()
                {
                    Assert.AreEqual(2, Solution.MissingNumber(new int[] { 1 }));
                }
                [TestMethod]
                public void TestMethod6()
                {
                    Assert.AreEqual(2, Solution.MissingNumber(new int[] { 1, 3 }));
                }
            }";
            var methodName = "MissingNumber";
            var expectedOutput = @"25-Passed TestMethod1
                25-Passed TestMethod2
                25-Passed TestMethod3
                25-Passed TestMethod4";
            var testCode = @"[TestClass]
                public partial class MissingNumber
                {
                    [TestMethod, Timeout(5000)]
                    public void TestMethod1()
                    {
                        var missingnumber = FindMissing(new int[] { });
                        var missingnumber2 = FindMissing(new int[] { });
                        Assert.AreEqual(0, missingnumber);
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod2()
                    {
                        Assert.AreEqual(1, FindMissing(new int[] { 0, -1}));
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod3()
                    {
                        Random r = new Random();
                        int n = r.Next(10, 20);
                        int i = r.Next(-n, n);
                        int m = 0;
                        List<int> l = new List<int>();
                        for (int j = -n; j <= n; j++)
                        {
                            if (j != i) l.Add(j); else m = j;
                        }
                        List<int> l2 = new List<int>();
                        while (l.Count > 0)
                        {
                            int j = r.Next(0, l.Count - 1);
                            int x = l[j];
                            l2.Add(x);
                            l.Remove(x);
                        }
                        Assert.AreEqual(m, FindMissing(l2.ToArray()));
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod4()
                    {
                        Random r = new Random();
                        int n = r.Next(10, 20);
                        int i = r.Next(-n, n);
                        int m = 0;
                        List<int> l = new List<int>();
                        for (int j = -n; j <= n; j++)
                        {
                            if (j != i) l.Add(j); else m = j;
                        }
                        List<int> l2 = new List<int>();
                        while (l.Count > 0)
                        {
                            int j = r.Next(0, l.Count - 1);
                            int x = l[j];
                            l2.Add(x);
                            l.Remove(x);
                        }
                        Assert.AreEqual(m, FindMissing(l2.ToArray()));
                    }
                }";
            var parameterType = "System.Int32[]";

            var controller = new AssignmentController(httpContextObject);
            var response = controller.RunCodeForValidationAPI(new RunCodeForValidationInput { Solution = solution, ExpectedOutput = expectedOutput, Instructions = instructions, Language = "C#", TestCode = testCode, Script = script, ParameterTypes = parameterType, VarValuePairs = new Dictionary<string, string> { {"a", "2" } }, After = "//Test", Before = "//Test"  });

            var okResponse = response as OkObjectResult;

            var resultValue = okResponse.Value as ExecutionResult;
            Assert.IsNotNull(okResponse);
        }

        [TestMethod]
        [DataRow(1)]
        public void RunCodingProblemWithSolution_ReturnsOkResponse(int codingProblemId)
        {
            httpContextObject.HttpContext.Request.Host = new HostString("localhost");

            var solution = @"public partial class MissingNumberSol
                {
                    public int FindMissing(int[] arr)
                    {
                        // Your code starts here
                        int res = 0;
                        foreach (int a in arr)
                            res += a;
                        return -res;
                        // Your code ends here
                    }
                }";

            var controller = new AssignmentController(httpContextObject);
            var response = controller.RunCode(new Input { Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", CourseInstanceId = 115, Code = solution, CodeStructurePoints = 1, CodingProblemId = codingProblemId });
            
            var okResponse = response as OkObjectResult;

            var resultValue = okResponse.Value as CompilerResultInfo;

            Assert.IsTrue(resultValue.CodeHints.Count() > 0);

        }

        [TestMethod]
        public void RunCodingProblemFirstTimeWithSolution_Returns()
        {
            httpContextObject.HttpContext.Request.Host = new HostString("localhost");

            var solution = @"public partial class MissingNumberSol
                {
                    public int FindMissing(int[] arr)
                    {
                        // Your code starts here
                        int res = 0;
                        foreach (int a in arr)
                            res += a;
                        return -res;
                        // Your code ends here
                    }
                }";

            var controller = new AssignmentController(httpContextObject);

            var response = controller.RunCode(new Input { Hash = "56639f07-c41c-4580-b717-375872278323", CourseInstanceId = 115, Code = solution, CodeStructurePoints = 1, CodingProblemId = 1 });

            var okResponse = response as OkObjectResult;

            var resultValue = okResponse.Value as CompilerResultInfo;

            Assert.AreEqual(resultValue.Attempts, 100);
            Assert.AreEqual(resultValue.Submissions, 1);
            Assert.IsFalse(resultValue.MaxReached);

            DeleteInsertedSubmission(712, 1);
        }

        [TestMethod]
        public void AssignmentControllerLoadTest_ReturnsValidValues()
        {
            var response = AssignmentController.LoadTest("bce20431-5af2-4837-812f-5a2c5b65ce53", 349);
            Assert.AreEqual(response.Item1.Attempts, 100);
            Assert.AreEqual(response.Item1.Instructions, "<p>Write code to add 2 numbers</p>");
            Assert.AreEqual(response.Item1.Parameters, "");
            Assert.IsTrue(response.Item1.Active);
            Assert.AreEqual(response.Item1.ClassName, "");

            Assert.AreEqual(response.Item2.Email, "unittestaccount@gmail.com");
            Assert.AreEqual(response.Item2.StudentId, 708);

            Assert.IsTrue(response.Item3.Count > 0);

        }

        [TestMethod]
        public void GetInstanceWithoutMemoryTest_ReturnsValidValues()
        {
            var instructions = @"<p>There is a number N (i.e. N = 3).</p>";
           
            var solution = @"public static int Sum(int num1, int num2)
            {
                int ${{studentid}};
                int ${{a,1}};
                int ${total} = ${{a,2}} + ${{b}};
                return ${{total}};
            }";
            var className = @"[TestClass]
            public class UnitTest1
            {
                [TestMethod]
                public void TestMethod1()
                {
                    Assert.AreEqual(2, Solution.MissingNumber(new int[] { 3, 4, 1 }));
                }
                [TestMethod]
                public void TestMethod2()
                {
                    Assert.AreEqual(8, Solution.MissingNumber(new int[] { 9, 6, 4, 2, 3, 5, 7, 10, 1 }));
                }
                [TestMethod]
                public void TestMethod3()
                {
                    Assert.AreEqual(1, Solution.MissingNumber(new int[] {  }));
                }
                [TestMethod]
                public void TestMethod4()
                {
                    Assert.AreEqual(1, Solution.MissingNumber(new int[] { 2 }));
                }
                [TestMethod]
                public void TestMethod5()
                {
                    Assert.AreEqual(2, Solution.MissingNumber(new int[] { 1 }));
                }
                [TestMethod]
                public void TestMethod6()
                {
                    Assert.AreEqual(2, Solution.MissingNumber(new int[] { 1, 3 }));
                }
            }";
            var methodName = "MissingNumber";
            var expectedOutput = @"25-Passed TestMethod1
                25-Passed TestMethod2
                25-Passed TestMethod3
                25-Passed TestMethod4";
            var testCode = @"[TestClass]
                public partial class MissingNumber
                {
                    [TestMethod, Timeout(5000)]
                    public void TestMethod1()
                    {
                        Assert.AreEqual(0, FindMissing(new int[] { }));
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod2()
                    {
                        Assert.AreEqual(1, FindMissing(new int[] { 0, -1}));
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod3()
                    {
                        Random r = new Random();
                        int n = r.Next(10, 20);
                        int i = r.Next(-n, n);
                        int m = 0;
                        List<int> l = new List<int>();
                        for (int j = -n; j <= n; j++)
                        {
                            if (j != i) l.Add(j); else m = j;
                        }
                        List<int> l2 = new List<int>();
                        while (l.Count > 0)
                        {
                            int j = r.Next(0, l.Count - 1);
                            int x = l[j];
                            l2.Add(x);
                            l.Remove(x);
                        }
                        Assert.AreEqual(m, FindMissing(l2.ToArray()));
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod4()
                    {
                        Random r = new Random();
                        int n = r.Next(10, 20);
                        int i = r.Next(-n, n);
                        int m = 0;
                        List<int> l = new List<int>();
                        for (int j = -n; j <= n; j++)
                        {
                            if (j != i) l.Add(j); else m = j;
                        }
                        List<int> l2 = new List<int>();
                        while (l.Count > 0)
                        {
                            int j = r.Next(0, l.Count - 1);
                            int x = l[j];
                            l2.Add(x);
                            l.Remove(x);
                        }
                        Assert.AreEqual(m, FindMissing(l2.ToArray()));
                    }
                }";
            var response = AssignmentController.GetInstancesWithoutMemoryTest(new VmCodingProblem { Id = 349, Instructions = instructions, ExpectedOutput = expectedOutput, ClassName = className, Solution = solution, MethodName = methodName, TestCode = testCode });

            Assert.AreEqual(response.Count, 3);
            Assert.AreEqual(response.Where(a => a.varName == "a").Count(), 2);
            Assert.AreEqual(response.Where(a => a.varName == "a").Select(a => a.occurenceNumber).Max(), "2");
            
            Assert.AreEqual(response.Where(a => a.varName == "b").Count(), 1);
            Assert.IsNull(response.Where(a => a.varName == "b").Select(a => a.occurenceNumber).FirstOrDefault());
        }

        [TestMethod]
        public void SetCodingProblemId_SetTheEnteredId()
        {
            var codingProblem = new VmCodingProblem { Id = 341, ClassName = "setcodingproblemtest", Active = true, After = "aftertest", Before = "beforetest", Attempts = 1, ExpectedOutput = "validtestoutput", Language = "C#", Instructions = "testinstructions", MaxGrade = 1, MethodName = "testmethod", Parameters = "testparameters", ParameterTypes = "testparametertype", Solution = "testsolution" };
            AssignmentController.SetCodingProblem(codingProblem);

            var response = AssignmentController.GetCurrentCodingProblem();
            Assert.AreEqual(response.Id, codingProblem.Id);
            Assert.AreEqual(response.ClassName, codingProblem.ClassName);
            Assert.AreEqual(response.Active, codingProblem.Active);
            Assert.AreEqual(response.After, codingProblem.After);
            Assert.AreEqual(response.Before, codingProblem.Before);
            Assert.AreEqual(response.Attempts, codingProblem.Attempts);
            Assert.AreEqual(response.ExpectedOutput, codingProblem.ExpectedOutput);
            Assert.AreEqual(response.Language, codingProblem.Language);
            Assert.AreEqual(response.Instructions, codingProblem.Instructions);
            Assert.AreEqual(response.MaxGrade, codingProblem.MaxGrade);
            Assert.AreEqual(response.MethodName, codingProblem.MethodName);
            Assert.AreEqual(response.Parameters, codingProblem.Parameters);
            Assert.AreEqual(response.ParameterTypes, codingProblem.ParameterTypes);
            Assert.AreEqual(response.Solution, codingProblem.Solution);
        }

        [TestMethod]
        public void GetMultipleInstancesTest_ReturnsMultipleInstances()
        {
            var instructions = @"<p>There is a number N (i.e. N = 3).</p>";
           
            var solution = @"public partial class MissingNumberSol
                {
                    int ${a,1}
                    int ${b,1};
                    public int FindMissing(int[] arr)
                    {
                        
                        // Your code starts here
                        int res = ${a,2};
                        foreach (int a in arr)
                            res += a;
                        return -res;
                        // Your code ends here
                    }
                }";
            var className = @"[TestClass]
            public class UnitTest1
            {
                [TestMethod]
                public void TestMethod1()
                {
                    Assert.AreEqual(2, Solution.MissingNumber(new int[] { 3, 4, 1 }));
                }
            }";
            var methodName = "MissingNumber";
            var expectedOutput = @"25-Passed TestMethod1
                25-Passed TestMethod2
                25-Passed TestMethod3
                25-Passed TestMethod4";
            var testCode = @"[TestClass]
                public partial class MissingNumber
                {
                    [TestMethod, Timeout(5000)]
                    public void TestMethod1()
                    
                        Assert.AreEqual(0, FindMissing(new int[] { }));
                    }
                }";
            var response = AssignmentController.GetMultipleInstancesTest(new VmCodingProblem { Id = 349, Instructions = instructions, ExpectedOutput = expectedOutput, ClassName = className, Solution = solution, MethodName = methodName, TestCode = testCode });

            Assert.IsTrue(response.Count() == 2);
            Assert.IsTrue(response[0].varName == "a");
            Assert.IsTrue(response[0].instances.Count() == 2);

            Assert.IsTrue(response[1].varName == "b");
            Assert.IsTrue(response[1].instances.Count() == 1);
        }

        [TestMethod]
        public void InitializeVariablesInStringTest_ReturnedReplacedVariableValues()
        {
            var codestr = @"public static int Sum(int num1, int num2)
            {
                int ${studentid};
                int ${total} = ${num1,1} + ${num2};
                return ${total};
            }";

            var variables = new HashSet<(string varName, string varValue, string ocurrenceNumber)> { new("total", "2", null), new("num1", "1", "1"), new("num2", "1", null), new ("studentid", null, "708") };
            var result = AssignmentController.InitializeVariablesInStringTest(codestr, variables, "708");

            codestr = codestr.Replace("${studentid}", "708");
            codestr = codestr.Replace("${total}", "2");
            codestr = codestr.Replace("${num1,1}", "1");
            codestr = codestr.Replace("${num2}", "1");
            Assert.AreEqual(codestr, result);
        }

        [TestMethod]
        public void GetCodingProblemVariablesTest_ReturnsVariablesWithValues()
        {
            var variables = new List<VmVariableValue> { 
                new VmVariableValue { CodingProblemId = 349, idVariableValue = 21, possibleValues = "-1,0,1,800,111..122..345:999:1", VarName = "a" },
                new VmVariableValue { CodingProblemId = 349, idVariableValue = 22, possibleValues = "-999,0,1,8,9..10:11:12", VarName = "b" }
            };

            var result = AssignmentController.GetCodingProblemVariablesTest(variables);

            Assert.AreEqual(result.Count, 2);
            var numa = int.Parse(result["a"]);
            var numb = int.Parse(result["b"]);
            Assert.IsTrue(numa >= -1 && numa <= 999);
            Assert.IsTrue(numb >= -999 && numb <= 12);
        }

        [TestMethod]
        public void GetProductionCompilerAPIURL_ReturnsValidURL()
        {
            var productionURL = ConfigurationHelper.GetApiBaseURL();
            Assert.AreEqual(productionURL, "https://compilerapi.letsusedata.com/api/");
        }

        private void DeleteInsertedSubmission(int studentId, int codingProblemId)
        {
            var sqlQuery = $@"SELECT Id from Submission where StudentId = {studentId} and CodingProblemId = {codingProblemId}";
            var selectResult = SQLHelper.RunSqlQuery(sqlQuery);
            if (selectResult[0][0] != null)
            {
                sqlQuery = $@"DELETE FROM SubmissionCodeError WHERE SubmissionId = {selectResult[0][0]}";
                Assert.IsTrue(SQLHelper.RunSqlUpdate(sqlQuery));
            }
            sqlQuery = $@"DELETE FROM Submission WHERE StudentId = {studentId} AND CodingProblemId = {codingProblemId} ;";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(sqlQuery) > 0);
        }
    }
}
