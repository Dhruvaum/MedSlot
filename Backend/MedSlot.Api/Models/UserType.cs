using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class UserType
{
    public Guid Id { get; set; }

    public string? TypeName { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
