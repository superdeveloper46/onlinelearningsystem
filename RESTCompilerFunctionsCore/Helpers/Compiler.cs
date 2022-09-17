//using CompilerFunctionsTemp;
//using Compilers;
using CompilersCore;
using LMS.Common.Infos;
using LMS.Common.SharedFunctions;

namespace RESTCompilerFunctionsCore.Helpers
{
    public static partial class Compiler
    {
        public static ExecutionResult CompilerRunCodeForValidation(CompilerApiInput compilerApiInput/*, IWebHostEnvironment env*/)
        {
            RunInfo runInfo = compilerApiInput.RunInfo;

            //runInfo.Path = HttpRuntime.AppDomainAppPath;
            //runInfo.Path = env.ContentRootPath;
            string path = @"\";
            runInfo.Path = Directory.GetCurrentDirectory() + path;
            return RunCodeForValidation(runInfo, compilerApiInput.CompilerInfo);
        }
        public static ExecutionResult CompilerRunCode(CompilerRunApiInput compilerApiInput/*, IWebHostEnvironment env*/)
        {
            RunInfo runInfo = compilerApiInput.RunInfo;

            //runInfo.Path = HttpRuntime.AppDomainAppPath;
            //runInfo.Path = env.ContentRootPath;
            string path = @"\";
            runInfo.Path = Directory.GetCurrentDirectory() + path;
            return Run(runInfo, compilerApiInput.CompilerInfo, compilerApiInput.instancesData, compilerApiInput.StudentId);
        }

        public static ExecutionResult Run(RunInfo runInfo, CompilerInfo compilerInfo, HashSet<(string varName, string varValue, string ocurrenceNumber)> instancesData, string studentId)
        {
            CloudCompiler compiler = CloudCompiler.GetCompiler(runInfo.Language, runInfo.Path);
            compiler.ReplaceFuntion = (value) => SharedFunctions.InitializeVariablesInString(value, instancesData, studentId);
            return compiler.Run(runInfo, compilerInfo);

            //try
            //{
            //    CloudCompiler compiler;
            //    if (runInfo.Language == "Excel")
            //    {
            //        var excelCompiler = CompilersCore.CloudCompiler.GetCompiler(runInfo.Language, runInfo.Path);
            //        excelCompiler.ReplaceFuntion = (value) => SharedFunctions.InitializeVariablesInString(value, instancesData, studentId);
            //        return excelCompiler.Run(runInfo, compilerInfo);
            //    }
            //    else
            //    {
            //        compiler = CloudCompiler.GetCompiler(runInfo.Language, runInfo.Path);
            //        compiler.ReplaceFuntion = (value) => SharedFunctions.InitializeVariablesInString(value, instancesData, studentId);
            //        return compiler.Run(runInfo, compilerInfo);
            //    }
            //}
            //catch (Exception ex)
            //{
            //    return null;
            //} 
        }
        public static ExecutionResult RunCodeForValidation(RunInfo runInfo, CompilerInfo compilerInfo)
        {
            CloudCompiler compiler = CloudCompiler.GetCompiler(runInfo.Language, runInfo.Path);
            return compiler.RunCodeForValidation(runInfo, compilerInfo);

            //if(runInfo.Language == "Excel")
            //{
            //    var excelCompiler = CompilersCore.CloudCompiler.GetCompiler(runInfo.Language, runInfo.Path);
            //    return excelCompiler.RunCodeForValidation(runInfo, compilerInfo);
            //}
            //else
            //{
            //    compiler = CloudCompiler.GetCompiler(runInfo.Language, runInfo.Path);
            //    return compiler.RunCodeForValidation(runInfo, compilerInfo);
            //}
        }
    } // end of public static partial class Compiler
}