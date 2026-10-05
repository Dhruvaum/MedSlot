using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class DoctorAvailability
{
    public Guid Id { get; set; }

    public Guid DoctorId { get; set; }

    public byte DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;
}
