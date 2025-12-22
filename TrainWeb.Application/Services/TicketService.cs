using QRCoder;
using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;
using TrainWeb.Domain.Exceptions;

namespace TrainWeb.Application.Services
{
    public class TicketService
    {
        private readonly ITicketRepository _ticketRepo;

        public TicketService(ITicketRepository ticketRepository)
        {
            _ticketRepo = ticketRepository;
        }

        public async Task<Ticket?> GetByIdAsync(string id)
        {
            var ticketEntity = await _ticketRepo.GetByIdAsync(id);
            return ticketEntity?.ToDomain();
        }

        public async Task<ImmutableList<Ticket>> GetAllAsync()
        {
            var ticketEntities = await _ticketRepo.GetAllAsync();

            return ticketEntities
                .Select(e => e.ToDomain())
                .ToImmutableList();
        }

        public async Task<ImmutableList<Ticket>> GetByBookingIdAsync(string bookingId)
        {
            var ticketEntities = await _ticketRepo.GetByBookingIdAsync(bookingId);
            return ticketEntities
                .Select(e => e.ToDomain())
                .ToImmutableList();
        }

        public async Task<Ticket> CreateForBookingAsync(string bookingId)
        {
            // 1 booking chỉ nên có 1 ticket -> chống tạo trùng khi IPN gọi nhiều lần
            var existedEntities = await _ticketRepo.GetByBookingIdAsync(bookingId);
            var existed = existedEntities.FirstOrDefault();
            if (existed != null)
                return existed.ToDomain();

            var ticketNumber = $"TIC_{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";
            var qrPayload = ticketNumber; // hoặc $"{bookingId}|{ticketNumber}"

            var ticket = new Ticket(
                id: null,
                bookingId: bookingId,
                ticketNumber: ticketNumber,
                qrCode: qrPayload,
                status: TicketStatus.Active,
                createdAt: DateTime.UtcNow,
                activeAt: DateTime.UtcNow
            );

            var entity = TicketEntity.FromDomain(ticket);
            await _ticketRepo.AddAsync(entity);

            return entity.ToDomain();
        }


        public async Task<Ticket> AddAsync(Ticket ticket)
        {
            // Nếu bạn muốn backend tự sinh ticketNumber/qrCode khi client không truyền
            var ticketNumber = string.IsNullOrWhiteSpace(ticket.TicketNumber)
                ? $"TIC_{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}"
                : ticket.TicketNumber;

            var qrPayload = string.IsNullOrWhiteSpace(ticket.QrCode)
                ? ticketNumber
                : ticket.QrCode;

            // Chuẩn hoá ticket trước khi lưu
            var normalized = new Ticket(
                id: ticket.Id,
                bookingId: ticket.BookingId,
                ticketNumber: ticketNumber,
                qrCode: qrPayload,
                status: ticket.Status,
                createdAt: ticket.CreatedAt,
                activeAt: ticket.ActiveAt
            );

            var entity = TicketEntity.FromDomain(normalized);
            await _ticketRepo.AddAsync(entity);

            return entity.ToDomain();
        }

        public async Task<Ticket?> UpdateAsync(string id, Ticket ticket)
        {
            var entity = TicketEntity.FromDomain(ticket);
            await _ticketRepo.UpdateAsync(id, entity);

            var updated = await _ticketRepo.GetByIdAsync(id);
            return updated?.ToDomain();
        }

        public Task DeleteAsync(string id)
            => _ticketRepo.DeleteAsync(id);

        // Mark Used
        public async Task UsedTicketAsync(string id)
        {
            var entity = await _ticketRepo.GetByIdAsync(id);
            if (entity == null) throw new NotFoundException("Ticket Not Found");

            entity.Status = TicketStatus.Used.ToString().ToLowerInvariant(); // "used"
            await _ticketRepo.UpdateAsync(id, entity);
        }

        // Mark Cancelled
        public async Task CancelledTicketAsync(string id)
        {
            var entity = await _ticketRepo.GetByIdAsync(id);
            if (entity == null) throw new NotFoundException("Ticket Not Found");

            entity.Status = TicketStatus.Cancelled.ToString().ToLowerInvariant(); // "cancelled"
            await _ticketRepo.UpdateAsync(id, entity);
        }

        // Generate QR PNG bytes
        public async Task<byte[]> GetQrCodeTicket(string ticketId)
        {
            var entity = await _ticketRepo.GetByIdAsync(ticketId);
            if (entity == null) throw new NotFoundException("Ticket Not Found");

            // QR encode payload: ưu tiên qrCode field, fallback ticketNumber, fallback ticketId
            var payload = !string.IsNullOrWhiteSpace(entity.QrCode)
                ? entity.QrCode
                : (!string.IsNullOrWhiteSpace(entity.TicketNumber) ? entity.TicketNumber : ticketId);

            using var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new PngByteQRCode(qrCodeData);

            return qrCode.GetGraphic(20);
        }
    }
}
