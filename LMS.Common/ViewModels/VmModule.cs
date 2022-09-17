﻿using System;

namespace LMS.Common.ViewModels
{
    public class VmModule
    {
        public string Description { get; set; }
        public Nullable<System.DateTime> DueDate { get; set; }
        public bool Active { get; set; }
        public int Id { get; set; }
        public string Location { get; set; }
    }
}