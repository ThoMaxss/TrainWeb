using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public sealed class User
    {
        public string? Id { get; }
        public string? Name { get; }
        public string? Email { get; }
        public UserRole? Role { get; }
        public DateTime? CreatedAt { get; }

        public User(string? id, string? name, string? email, UserRole? role, DateTime? createdAt)
        {
            Id = id;
            Name = name;
            Email = email;
            Role = role;
            CreatedAt = createdAt;
        }
    }
}
