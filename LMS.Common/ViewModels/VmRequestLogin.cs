namespace LMS.Common.ViewModels
{
    public class VmRequestLogin
    {
        public int RequestLoginId { get; set; }
        public string SchoolName { get; set; }
        public string CourseName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public System.DateTime TimeStamp { get; set; }
        public int ApprovalStatus { get; set; }
    }
}