using System;

namespace LMS.Common.ViewModels
{
    public class VmCodingProblemAllInfo
    {
        public VmSubmission Submission { get; set; }
        public VmStudentGradeable StudentGradeable { get; set; }
        public int totalSubmission { get; set; }
        public DateTime? dueDate { get; set; }
    }
}