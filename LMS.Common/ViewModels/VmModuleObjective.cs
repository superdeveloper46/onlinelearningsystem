using System;

namespace LMS.Common.ViewModels
{
    public class VmModuleObjective
    {
        public string Description { get; set; }
        public bool Active { get; set; }
        public int Id { get; set; }
        public Nullable<System.DateTime> DueDate { get; set; }
    }
}
