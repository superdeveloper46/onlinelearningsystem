//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EFModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class PollGroup
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PollGroup()
        {
            this.CourseInstancePollGroups = new HashSet<CourseInstancePollGroup>();
            this.PollParticipantAnswers = new HashSet<PollParticipantAnswer>();
            this.PollGroupPollQuestions = new HashSet<PollGroupPollQuestion>();
        }
    
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Active { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CourseInstancePollGroup> CourseInstancePollGroups { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PollParticipantAnswer> PollParticipantAnswers { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PollGroupPollQuestion> PollGroupPollQuestions { get; set; }
    }
}
