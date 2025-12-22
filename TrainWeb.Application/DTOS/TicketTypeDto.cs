namespace TrainWeb.Application.DTOS
{
    public sealed class TicketTypeDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }

        public double DiscountPercent { get; set; } = 0;
    }
}
