using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class Doctor
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public Guid SpecializationId { get; set; }

    public string RegistrationNumber { get; set; } = null!;

    public string RegisteringCouncil { get; set; } = null!;

    public Guid QualificationId { get; set; }

    public string WorkAddress { get; set; } = null!;

    public int VerificationStatus { get; set; }

    public int? ConsultDurationMinutes { get; set; }

    public virtual ICollection<DoctorAvailability> DoctorAvailabilities { get; set; } = new List<DoctorAvailability>();

    public virtual Qualification Qualification { get; set; } = null!;

    public virtual Specialization Specialization { get; set; } = null!;

    public virtual ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();

    public virtual User User { get; set; } = null!;
}
