using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class TimeSlot
{
    public Guid Id { get; set; }

    public Guid DoctorId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public bool IsBooked { get; set; }

    public byte[] RowVersion { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Appointment? Appointment { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;
}
