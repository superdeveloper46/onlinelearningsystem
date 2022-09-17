namespace LMS.Common.ViewModels
{
    public class VmCourseInstance
    {
        public int Id { get; set; }
        public bool Active { get; set; }
        public int QuarterId { get; set; }
        public int CourseId { get; set; }
        public bool Testing { get; set; }
    }
}