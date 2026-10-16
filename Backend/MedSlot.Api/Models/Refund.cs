using System;
using System.Collections.Generic;

namespace MedSlot.Api.Models;

public partial class Refund
{
    public Guid Id { get; set; }

    public Guid PaymentId { get; set; }

    public decimal Amount { get; set; }

    public string? Reason { get; set; }

    public string? GatewayRefundId { get; set; }

    public DateTime? RefundedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Payment Payment { get; set; } = null!;
}
