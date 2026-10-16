using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class PaymentAttempt
{
    public Guid Id { get; set; }

    public Guid PaymentId { get; set; }

    public string? GatewayPaymentId { get; set; }

    public Guid PaymentStatusId { get; set; }

    public string? ErrorCode { get; set; }

    public string? ErrorMessage { get; set; }

    public DateTime AttemptedAt { get; set; }

    public virtual Payment Payment { get; set; } = null!;

    public virtual PaymentStatus PaymentStatus { get; set; } = null!;
}
