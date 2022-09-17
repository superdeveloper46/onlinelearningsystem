namespace LMS.Common.ViewModels
{
    public class VmInstructorCourse
    {
        public int InstructorId { get; set; }
        public int CourseInstanceId { get; set; }
        public string Role { get; set; }
        public bool Active { get; set; }
        public string InstructorName { get; set; }
    }
}
