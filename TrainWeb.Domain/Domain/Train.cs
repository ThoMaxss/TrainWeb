namespace TrainWeb.Domain.Domain
{
    public class Train
    {
        public string Id { get; }
        public string Name { get; }
        public string Type { get; }
        public DateTime CreatedAt { get; }

        public Train(string id, string name, string type, DateTime? createdAt = null)
        {
            Id = id;
            Name = name;
            Type = type;
            CreatedAt = createdAt ?? DateTime.UtcNow;
        }
    }
}
