﻿namespace LMS.Common.ViewModels
{
    public class VmQuarter
    {
        public int QuarterId { get; set; }
        public int SchoolId { get; set; }
        public System.DateTime StartDate { get; set; }
        public System.DateTime EndDate { get; set; }
        public System.DateTime WithdrawDate { get; set; }
        public bool Active { get; set; }
        public string Name { get; set; }

    }
}