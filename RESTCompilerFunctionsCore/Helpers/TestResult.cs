namespace RESTCompilerFunctionsCore.Helpers;

public struct TestResult
{
    public string Input;
    public string Expected;
    public string Actual;
    public IEnumerable<string> ActualErrors;
    public string Result;
    public bool Passed;
}
