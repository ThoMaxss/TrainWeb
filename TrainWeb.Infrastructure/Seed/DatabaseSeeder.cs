using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enums;
using TrainWeb.Infrastructure.Data;

namespace TrainWeb.Infrastructure.Seed
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseSeeder");
            var context = services.GetRequiredService<ApplicationDbContext>();

            await context.Database.EnsureCreatedAsync();

            if (!context.Users.Any())
            {
                logger.LogInformation("Seeding users...");
                var admin = CreateUser("admin@example.com", "Admin User", UserRole.Admin, "Admin@123");
                var staff = CreateUser("staff@example.com", "Staff User", UserRole.Staff, "Staff@123");
                var customer = CreateUser("customer@example.com", "Customer User", UserRole.Customer, "Customer@123");
                context.Users.AddRange(admin, staff, customer);
                await context.SaveChangesAsync();
            }

            if (!context.TicketTypes.Any())
            {
                logger.LogInformation("Seeding ticket types...");
                context.TicketTypes.AddRange(
                    new TicketType { Id = Guid.NewGuid().ToString(), Name = "Standard", DiscountPercentage = "0", DisplayOrder = 1, IsActive = true },
                    new TicketType { Id = Guid.NewGuid().ToString(), Name = "Student", DiscountPercentage = "10", DisplayOrder = 2, IsActive = true },
                    new TicketType { Id = Guid.NewGuid().ToString(), Name = "Senior", DiscountPercentage = "15", DisplayOrder = 3, IsActive = true }
                );
                await context.SaveChangesAsync();
            }

            if (!context.Trains.Any())
            {
                logger.LogInformation("Seeding trains and trips with seats...");
                var train1 = new Train
                {
                    Id = Guid.NewGuid().ToString(),
                    TrainNumber = "SE7-2025",
                    TrainName = "Sunrise Express",
                    TrainType = "Express",
                    HardSeats = 120,
                    SoftSeats = 80,
                    TotalSeats = 200,
                    AvailableSeats = 200,
                    Amenities = "WiFi,AC,Food",
                    HasAC = true,
                    HasWiFi = true,
                    HasFoodService = true,
                    HasToilet = true,
                    MaxSpeed = "140",
                    Manufacturer = "Hitachi",
                    YearOfManufacture = 2021,
                    OperatingCompany = "VN Rail",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                var train2 = new Train
                {
                    Id = Guid.NewGuid().ToString(),
                    TrainNumber = "SE9-2025",
                    TrainName = "Coastliner",
                    TrainType = "Express",
                    HardSeats = 100,
                    SoftSeats = 60,
                    TotalSeats = 160,
                    AvailableSeats = 160,
                    Amenities = "WiFi,AC",
                    HasAC = true,
                    HasWiFi = true,
                    HasFoodService = false,
                    HasToilet = true,
                    MaxSpeed = "120",
                    Manufacturer = "CRRC",
                    YearOfManufacture = 2020,
                    OperatingCompany = "VN Rail",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                context.Trains.AddRange(train1, train2);
                await context.SaveChangesAsync();

                var trips = new List<Trip>
                {
                    CreateTrip(train1.Id, "Hanoi", "Da Nang", new DateTime(2025,12,20,8,0,0,DateTimeKind.Utc), new DateTime(2025,12,20,15,30,0,DateTimeKind.Utc), 850000m, "5", "Holiday promo"),
                    CreateTrip(train2.Id, "Hanoi", "Hue", new DateTime(2025,12,21,22,0,0,DateTimeKind.Utc), new DateTime(2025,12,22,6,0,0,DateTimeKind.Utc), 650000m, "0", "Overnight"),
                    CreateTrip(train1.Id, "Hanoi", "Saigon", new DateTime(2025,12,23,6,0,0,DateTimeKind.Utc), new DateTime(2025,12,23,22,0,0,DateTimeKind.Utc), 1250000m, "7", "Long haul")
                };

                context.Trips.AddRange(trips);
                await context.SaveChangesAsync();

                foreach (var trip in trips)
                {
                    var train = trip.TrainId == train1.Id ? train1 : train2;
                    var seats = GenerateSeats(trip, train.HardSeats, train.SoftSeats);
                    context.Seats.AddRange(seats);
                }
                await context.SaveChangesAsync();
            }

            // Seed sample bookings/payments/tickets if none
            if (!context.Bookings.Any())
            {
                logger.LogInformation("Seeding bookings, payments, and tickets...");
                var userId = context.Users.First(u => u.Email == "customer@example.com").Id;
                var trip1 = await context.Trips.FirstAsync();
                var trip2 = await context.Trips.Skip(1).FirstAsync();

                var booking1 = CreateBooking(userId, trip1.Id, 2, "Standard", BookingStatus.Completed, 850000m, 5m);
                var booking2 = CreateBooking(userId, trip2.Id, 3, "Standard", BookingStatus.Paid, 650000m, 0m);

                context.Bookings.AddRange(booking1, booking2);
                await context.SaveChangesAsync();

                // Mark seats booked for booking1 (first two seats of trip1)
                var trip1Seats = context.Seats.Where(s => s.TripId == trip1.Id && s.IsAvailable).OrderBy(s => s.SeatNumber).Take(2).ToList();
                foreach (var seat in trip1Seats)
                {
                    seat.IsAvailable = false;
                    seat.BookedByUserId = userId;
                    seat.BookedAt = DateTime.UtcNow;
                    seat.BookingReference = booking1.BookingReference;
                }

                // Mark seats booked for booking2 (first three seats of trip2)
                var trip2Seats = context.Seats.Where(s => s.TripId == trip2.Id && s.IsAvailable).OrderBy(s => s.SeatNumber).Take(3).ToList();
                foreach (var seat in trip2Seats)
                {
                    seat.IsAvailable = false;
                    seat.BookedByUserId = userId;
                    seat.BookedAt = DateTime.UtcNow;
                    seat.BookingReference = booking2.BookingReference;
                }

                trip1.SeatsAvailable -= 2;
                trip2.SeatsAvailable -= 3;

                // Payment + tickets for booking1 (completed)
                var payment1 = new Payment
                {
                    Id = Guid.NewGuid().ToString(),
                    BookingId = booking1.Id,
                    UserId = userId,
                    Amount = booking1.FinalAmount,
                    Method = PaymentMethod.Momo,
                    Status = PaymentStatus.Completed,
                    TransactionReference = $"TXN{DateTime.UtcNow:yyyyMMddHHmmss}SEED",
                    CreatedAt = DateTime.UtcNow,
                    ProcessedAt = DateTime.UtcNow
                };
                context.Payments.Add(payment1);
                booking1.PaymentId = payment1.Id;
                booking1.PaidAt = DateTime.UtcNow;

                var tickets1 = trip1Seats.Select((seat, idx) => new Ticket
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    BookingId = booking1.Id,
                    SeatId = seat.Id,
                    TicketNumber = $"TK{DateTime.UtcNow:yyyyMMdd}{Guid.NewGuid():N}".Substring(0, 18),
                    SeatNumber = seat.SeatNumber,
                    JourneyDate = trip1.TripDate,
                    DepartureStation = trip1.OriginStation,
                    ArrivalStation = trip1.DestinationStation,
                    DepartureTime = trip1.DepartureTime,
                    ArrivalTime = trip1.ArrivalTime,
                    Price = seat.Price,
                    Status = (int)TicketStatus.Active,
                    PassengerName = idx == 0 ? "Nguyen Van A" : "Tran Thi B",
                    SeatType = (int)seat.SeatType,
                    QRCode = $"QR-{Guid.NewGuid():N}",
                    CreatedAt = DateTime.UtcNow
                }).ToList();
                context.Tickets.AddRange(tickets1);

                // Payment pending for booking2
                var payment2 = new Payment
                {
                    Id = Guid.NewGuid().ToString(),
                    BookingId = booking2.Id,
                    UserId = userId,
                    Amount = booking2.FinalAmount,
                    Method = PaymentMethod.VnPay,
                    Status = PaymentStatus.Pending,
                    TransactionReference = $"TXN{DateTime.UtcNow:yyyyMMddHHmmss}SEED2",
                    CreatedAt = DateTime.UtcNow
                };
                context.Payments.Add(payment2);
                booking2.PaymentId = payment2.Id;

                await context.SaveChangesAsync();
            }

            // Seed feedback if empty
            if (!context.Feedbacks.Any())
            {
                logger.LogInformation("Seeding feedback...");
                var userId = context.Users.First(u => u.Email == "customer@example.com").Id;
                var tripId = context.Trips.First().Id;
                context.Feedbacks.Add(new Feedback
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    TripId = tripId,
                    Subject = "Great trip",
                    Content = "On-time and clean coaches.",
                    Rating = 5,
                    Status = "Responded",
                    ResponseMessage = "Thanks for riding!",
                    RespondedByUserId = context.Users.First(u => u.Email == "staff@example.com").Id,
                    RespondedAt = DateTime.UtcNow,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow
                });
                await context.SaveChangesAsync();
            }
        }

        private static User CreateUser(string email, string fullName, UserRole role, string password)
        {
            return new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = email,
                FullName = fullName,
                PasswordHash = HashPassword(password),
                PhoneNumber = "0123456789",
                Address = "",
                UserRole = role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                IsEmailVerified = true,
                IsPhoneVerified = true
            };
        }

        private static Trip CreateTrip(string trainId, string origin, string destination, DateTime departure, DateTime arrival, decimal basePrice, string discount, string notes)
        {
            return new Trip
            {
                Id = Guid.NewGuid().ToString(),
                TrainId = trainId,
                OriginStation = origin,
                DestinationStation = destination,
                DepartureTime = departure,
                ArrivalTime = arrival,
                TripDate = departure.Date,
                BasePrice = basePrice.ToString("F2"),
                Discount = discount,
                Status = "Scheduled",
                TotalSeats = 0, // will set after seat generation
                SeatsAvailable = 0,
                Duration = (int)(arrival - departure).TotalMinutes,
                Notes = notes,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
        }

        private static IEnumerable<Seat> GenerateSeats(Trip trip, int hardSeats, int softSeats)
        {
            var seats = new List<Seat>();
            int seatNumber = 1;
            for (int i = 0; i < hardSeats; i++)
            {
                seats.Add(new Seat
                {
                    Id = Guid.NewGuid().ToString(),
                    TripId = trip.Id,
                    SeatNumber = $"HS{seatNumber++}",
                    SeatType = SeatType.HardSeat,
                    IsAvailable = true,
                    Price = trip.BasePrice,
                    CreatedAt = DateTime.UtcNow
                });
            }

            seatNumber = 1;
            for (int i = 0; i < softSeats; i++)
            {
                var softPrice = (decimal.Parse(trip.BasePrice) * 1.25m).ToString("F2");
                seats.Add(new Seat
                {
                    Id = Guid.NewGuid().ToString(),
                    TripId = trip.Id,
                    SeatNumber = $"SS{seatNumber++}",
                    SeatType = SeatType.SoftSeat,
                    IsAvailable = true,
                    Price = softPrice,
                    CreatedAt = DateTime.UtcNow
                });
            }

            trip.TotalSeats = seats.Count;
            trip.SeatsAvailable = seats.Count;
            return seats;
        }

        private static Booking CreateBooking(string userId, string tripId, int passengers, string ticketTypeName, BookingStatus status, decimal basePrice, decimal discountPercent)
        {
            var totalPrice = basePrice * passengers;
            var discountAmount = (totalPrice * discountPercent) / 100m;
            var taxAmount = (totalPrice - discountAmount) * 0.10m;
            var finalAmount = totalPrice - discountAmount + taxAmount;

            return new Booking
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                TripId = tripId,
                BookingReference = $"BK{Guid.NewGuid():N}".Substring(0, 10).ToUpper(),
                Status = status,
                NumberOfPassengers = passengers,
                TotalPrice = totalPrice.ToString("F2"),
                DiscountAmount = discountAmount.ToString("F2"),
                TaxAmount = taxAmount.ToString("F2"),
                FinalAmount = finalAmount.ToString("F2"),
                CreatedAt = DateTime.UtcNow,
                Notes = ticketTypeName
            };
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
