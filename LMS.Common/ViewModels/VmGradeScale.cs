namespace LMS.Common.ViewModels
{
    public class VmGradeScale
    {
        public int Id { get; set; }
        public int GradeScaleGroupId { get; set; }
        public double MaxNumberInPercent { get; set; }
        public double MinNumberInPercent { get; set; }
        public double GPA { get; set; }
    }
}