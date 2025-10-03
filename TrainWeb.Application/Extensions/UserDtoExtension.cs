using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Extensions
{
    public static class UserDtoExtension
    {
        public static UserDto ToDto(this User @this) => new UserDto
        {
            Id = @this.Id,
            Name = @this.Name,
            Email = @this.Email,
            Role = @this.Role,
            CreatedAt = @this.CreatedAt,
        };

        public static User FromDto(this UserDto @this) => new User(
            @this.Id,
            @this.Name, 
            @this.Email,
            @this.Role,
            @this.CreatedAt
        );
    }
}
