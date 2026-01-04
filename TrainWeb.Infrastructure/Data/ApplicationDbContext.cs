using Microsoft.EntityFrameworkCore;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Train> Trains { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(256);
            modelBuilder.Entity<User>()
                .Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(256);
            modelBuilder.Entity<User>()
                .Property(u => u.PasswordHash)
                .IsRequired();

            // Train Configuration
            modelBuilder.Entity<Train>()
                .HasKey(t => t.Id);
            modelBuilder.Entity<Train>()
                .HasIndex(t => t.TrainNumber)
                .IsUnique();
            modelBuilder.Entity<Train>()
                .Property(t => t.TrainNumber)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<Train>()
                .Property(t => t.TrainName)
                .IsRequired()
                .HasMaxLength(256);
            modelBuilder.Entity<Train>()
                .HasMany(t => t.Trips)
                .WithOne(tr => tr.Train)
                .HasForeignKey("TrainId")
                .OnDelete(DeleteBehavior.Restrict);

            // Trip Configuration
            modelBuilder.Entity<Trip>()
                .HasKey(t => t.Id);
            modelBuilder.Entity<Trip>()
                .Property(t => t.OriginStation)
                .IsRequired()
                .HasMaxLength(256);
            modelBuilder.Entity<Trip>()
                .Property(t => t.DestinationStation)
                .IsRequired()
                .HasMaxLength(256);
            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Seats)
                .WithOne(s => s.Trip)
                .HasForeignKey("TripId")
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Bookings)
                .WithOne(b => b.Trip)
                .HasForeignKey("TripId")
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Feedbacks)
                .WithOne(f => f.Trip)
                .HasForeignKey("TripId")
                .OnDelete(DeleteBehavior.SetNull);

            // Seat Configuration
            modelBuilder.Entity<Seat>()
                .HasKey(s => s.Id);
            modelBuilder.Entity<Seat>()
                .Property(s => s.SeatNumber)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<Seat>()
                .HasMany(s => s.Tickets)
                .WithOne(t => t.Seat)
                .HasForeignKey("SeatId")
                .OnDelete(DeleteBehavior.Restrict);

            // Booking Configuration
            modelBuilder.Entity<Booking>()
                .HasKey(b => b.Id);
            modelBuilder.Entity<Booking>()
                .Property(b => b.BookingReference)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<Booking>()
                .HasIndex(b => b.BookingReference)
                .IsUnique();
            modelBuilder.Entity<Booking>()
                .HasMany(b => b.Tickets)
                .WithOne(t => t.Booking)
                .HasForeignKey("BookingId")
                .OnDelete(DeleteBehavior.Cascade);

            // Ticket Configuration
            modelBuilder.Entity<Ticket>()
                .HasKey(t => t.Id);
            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.TicketNumber)
                .IsUnique();
            modelBuilder.Entity<Ticket>()
                .Property(t => t.TicketNumber)
                .IsRequired()
                .HasMaxLength(100);
            modelBuilder.Entity<Ticket>()
                .Property(t => t.SeatNumber)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Restrict);

            // TicketType Configuration
            modelBuilder.Entity<TicketType>()
                .HasKey(tt => tt.Id);
            modelBuilder.Entity<TicketType>()
                .Property(tt => tt.Name)
                .IsRequired()
                .HasMaxLength(256);
            modelBuilder.Entity<TicketType>()
                .HasMany(tt => tt.Tickets)
                .WithOne(t => t.TicketType)
                .HasForeignKey("TicketTypeId")
                .OnDelete(DeleteBehavior.SetNull);

            // Payment Configuration
            modelBuilder.Entity<Payment>()
                .HasKey(p => p.Id);
            modelBuilder.Entity<Payment>()
                .Property(p => p.TransactionReference)
                .HasMaxLength(256);
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithOne(b => b.Payment)
                .HasForeignKey<Payment>("BookingId")
                .OnDelete(DeleteBehavior.Restrict);

            // Feedback Configuration
            modelBuilder.Entity<Feedback>()
                .HasKey(f => f.Id);
            modelBuilder.Entity<Feedback>()
                .Property(f => f.Subject)
                .IsRequired()
                .HasMaxLength(500);
            modelBuilder.Entity<Feedback>()
                .Property(f => f.Content)
                .IsRequired();
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

