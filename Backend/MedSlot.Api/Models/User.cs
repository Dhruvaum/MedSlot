using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class User
{
    public Guid Id { get; set; }

    public Guid UserTypeId { get; set; }

    public string UserName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public bool IsRegistrationCompleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Doctor? Doctor { get; set; }

    public virtual Patient? Patient { get; set; }

    public virtual UserType UserType { get; set; } = null!;
}
