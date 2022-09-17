namespace LMS.Common.ViewModels
{
    public class VmGradingPolicy
    {
        public int Id { get; set; }
        public int SchoolId { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
    }
}
