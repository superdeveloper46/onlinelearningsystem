namespace RESTAdminPagesCore
{
    //
    // Data structure for a general http response
    //
    public class GeneralResponse
    {
        public int Code { get; set; }
        public string? Message { get; set; }

        public GeneralResponse(int code, string? message)
        {
            Code = code;
            Message = message;
        }
    }
}
