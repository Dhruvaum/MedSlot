using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class PaymentStatus
{
    public Guid Id { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<PaymentAttempt> PaymentAttempts { get; set; } = new List<PaymentAttempt>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
