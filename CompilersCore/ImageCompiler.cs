using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMS.Common.Infos;

namespace CompilersCore;
public class ImageCompiler : CloudCompiler
{
    internal ImageCompiler(string folder) : base(folder) { }
    public override ExecutionResult Run(RunInfo runInfo, CompilerInfo compilerInfo)
    {
        ExecutionResult er = new ExecutionResult
        {
            Compiled = true,
            Succeeded = true,
            Output = "Picture Saved",
            ActualErrors = new List<string>()
        };
        er.Message.Add("Picture Saved");
        er.Grade = 0;
        return er;
    }
}
