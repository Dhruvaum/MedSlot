using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class RegisteringCouncil
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}
