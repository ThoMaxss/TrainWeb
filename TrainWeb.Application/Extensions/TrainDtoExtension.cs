using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class TrainDtoExtension
    {
        public static TrainDto ToDto(this Train @this) => new TrainDto
        {
            Id = @this.Id,
            Name = @this.Name,
            Type = @this.Type,
        };

        public static Train FromDto(this TrainDto @this) => new Train(
            @this.Id,
            @this.Name,
            @this.Type
        );
    }
}
