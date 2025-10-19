using QRCoder;
using System.Collections.Immutable;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Exceptions;

namespace TrainWeb.Application.Services
{
    public class TicketService
    {
        private ITicketRepository TicketRepository { get; }
        private SeatService SeatService { get; }
        private TicketTypeService TicketTypeService { get; }

        public TicketService(
            ITicketRepository ticketRepository, 
            SeatService seatService,
            TicketTypeService ticketTypeService)
        {
            TicketRepository = ticketRepository;
            SeatService = seatService;
            TicketTypeService = ticketTypeService;
        }

        public async Task<Ticket?> GetById(string id)
        {
            var ticketEntity = await TicketRepository.GetByIdAsync(id);

            if (ticketEntity == null)
            {
                return null;
            }

            var seat = ticketEntity.SeatId != null
                ? await SeatService.GetById(ticketEntity.SeatId)
                : null;
            var ticketType = ticketEntity.TicketTypeId != null
                ? await TicketTypeService.GetById(ticketEntity.TicketTypeId)
                : null;
            return ticketEntity.ToDomain(seat, ticketType);
        }

        public async Task<ImmutableList<Ticket>> GetAllAsync()
        {
            var ticketEntities = await TicketRepository.GetAllAsync();
            return ticketEntities.Select(ticketEntity =>
            {
                var seat = ticketEntity.SeatId != null
                    ? SeatService.GetById(ticketEntity.SeatId).Result
                    : null;
                var ticketType = ticketEntity.TicketTypeId != null
                    ? TicketTypeService.GetById(ticketEntity.TicketTypeId).Result
                    : null;
                return ticketEntity.ToDomain(seat, ticketType);
            }).ToImmutableList();
        }

        public async Task<Ticket?> AddAsync(Ticket ticket)
        {
            var ticketEntity = TicketEntity.FromDomain(ticket);
            await TicketRepository.AddAsync(ticketEntity);

            var seat = ticketEntity.SeatId != null
                ? await SeatService.GetById(ticketEntity.SeatId)
                : null;
            var ticketType = ticketEntity.TicketTypeId != null
                ? await TicketTypeService.GetById(ticketEntity.TicketTypeId)
                : null;
            return ticketEntity.ToDomain(seat, ticketType);
        }

        public async Task<Ticket?> UpdateAsync(string id, Ticket ticket)
        {
            var ticketEntity = TicketEntity.FromDomain(ticket);
            await TicketRepository.UpdateAsync(id, ticketEntity);

            var seat = ticketEntity.SeatId != null
                ? await SeatService.GetById(ticketEntity.SeatId)
                : null;
            var ticketType = ticketEntity.TicketTypeId != null
                ? await TicketTypeService.GetById(ticketEntity.TicketTypeId)
                : null;
            return ticketEntity.ToDomain(seat, ticketType);
        }

        public async Task DeleteAsync(string id)
        {
            await TicketRepository.DeleteAsync(id);
        }

        public async Task UsedTicketAsync(string id, Ticket ticket)
        {
            ticket.Status = Domain.Enum.TicketStatus.Used;
            var ticketEntity = TicketEntity.FromDomain(ticket);
            await TicketRepository.UpdateAsync(id, ticketEntity);
        }

        public async Task CancelledTicketAsync(string id, Ticket ticket)
        {
            ticket.Status = Domain.Enum.TicketStatus.Cancelled;
            var ticketEntity = TicketEntity.FromDomain(ticket);
            await TicketRepository.UpdateAsync(id, ticketEntity);
        }

        public async Task<byte[]> GetQrCodeTicket(string ticketId)
        {
            var ticket = await TicketRepository.GetByIdAsync(ticketId);
            if(ticket == null)
            {
                throw new BadRequestException("Booking Not Found");
            }
            using var qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(ticketId, QRCodeGenerator.ECCLevel.Q);

            var qrCode = new PngByteQRCode(qrCodeData);
           return qrCode.GetGraphic(20);
        }
    }
}
