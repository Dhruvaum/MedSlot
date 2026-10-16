using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class Payment
{
    public Guid Id { get; set; }

    public Guid AppointmentId { get; set; }

    public decimal Amount { get; set; }

    public Guid PaymentStatusId { get; set; }

    public string? GatewayOrderId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Appointment Appointment { get; set; } = null!;

    public virtual ICollection<PaymentAttempt> PaymentAttempts { get; set; } = new List<PaymentAttempt>();

    public virtual PaymentStatus PaymentStatus { get; set; } = null!;

    public virtual ICollection<Refund> Refunds { get; set; } = new List<Refund>();
}
