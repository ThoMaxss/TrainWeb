namespace TrainWeb.Domain.Enums
{
    public enum UserRole
    {
        Admin = 0,
        Staff = 1,
        Customer = 2,
        Support = 3
    }

    public enum BookingStatus
    {
        Pending = 0,
        Paid = 1,
        Completed = 2,
        Cancelled = 3,
        Failed = 4
    }

    public enum TicketStatus
    {
        Active = 0,
        Used = 1,
        Cancelled = 2,
        Expired = 3
    }

    public enum PaymentMethod
    {
        Momo = 0,
        VnPay = 1,
        Card = 2,
        BankTransfer = 3
    }

    public enum PaymentStatus
    {
        Pending = 0,
        Completed = 1,
        Failed = 2,
        Refunded = 3
    }

    public enum SeatType
    {
        HardSeat = 0,
        SoftSeat = 1
    }
}
