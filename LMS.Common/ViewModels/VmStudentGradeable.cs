using System;

namespace LMS.Common.ViewModels
{
    public class VmStudentGradeable
    {
        public int StudentId { get; set; }
        public int Grade { get; set; }
        public int MaxGrade { get; set; }
        public int Id { get; set; }
        public Nullable<int> CodingProblemId { get; set; }
        public Nullable<int> CourseInstanceId { get; set; }
    }
}