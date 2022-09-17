using System.Collections.Generic;

namespace LMS.Common.Infos
{
    public struct CompilerApiInput
    {
        public CompilerInfo CompilerInfo { get; set; }
        public RunInfo RunInfo { get; set; }
    }

    public struct CompilerRunApiInput
    {
        public CompilerInfo CompilerInfo { get; set; }
        public RunInfo RunInfo { get; set; }
        public HashSet<(string, string, string)> instancesData { get; set; }

        public string StudentId { get; set; }
    }
}
