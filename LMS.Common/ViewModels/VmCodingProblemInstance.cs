﻿using System;

namespace LMS.Common.ViewModels
{
    public class VmCodingProblemInstance
    {
        public int idCodingProblemInstance { get; set; }
        public int CodingProblemId { get; set; }
        public int StudentId { get; set; }
        public string VarName { get; set; }
        public string VarValue { get; set; }
        public Nullable<int> idVariableValue { get; set; }
        public Nullable<int> occurrenceNumber { get; set; }

        public virtual VmCodingProblem CodingProblem { get; set; }
        public virtual VmVariableValue VariableValue { get; set; }
        public virtual VmStudent Student { get; set; }
    }
}