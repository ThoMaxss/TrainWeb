namespace TrainWeb.Application.DTOS
{
    public sealed class TrainDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
