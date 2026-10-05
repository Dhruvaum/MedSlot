using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class AppointmentStatus
{
    public Guid Id { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
