using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public class UserDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public UserRole Role { get; set; }
    }
}
