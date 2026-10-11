using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class Appointment
{
    public Guid Id { get; set; }

    public Guid TimeSlotId { get; set; }

    public Guid PatientId { get; set; }

    public Guid AppointmentStatusId { get; set; }

    public DateTime BookedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? PatientConcern { get; set; }

    public virtual AppointmentStatus AppointmentStatus { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;

    public virtual TimeSlot TimeSlot { get; set; } = null!;
}
