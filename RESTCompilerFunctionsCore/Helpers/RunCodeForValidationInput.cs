namespace RESTCompilerFunctionsCore.Helpers;

public class RunCodeForValidationInput
{
    public string Instructions { get; set; }
    public string Language { get; set; }
    public string Script { get; set; }
    public string Solution { get; set; }
    public string Before { get; set; }
    public string After { get; set; }
    public string ExpectedOutput { get; set; }
    public string TestCode { get; set; }
    public string ParameterTypes { get; set; }
    public Dictionary<string, string> VarValuePairs { get; set; }
}
