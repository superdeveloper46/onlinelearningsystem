using System.Collections.Generic;

namespace LMS.Common.ViewModels
{
    public class VmVideoMaterial
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public List<VmVideoMaterialStep> VideoMaterialSteps { get; set; }
    }
}