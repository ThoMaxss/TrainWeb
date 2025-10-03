using Google.Cloud.Firestore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class BookingService
    {
        private IBookingRepository BookingRepository { get; }
        private IUserRepository UserRepository { get; }
        private ITripRepository TripRepository { get; }
        private ITrainRepository TrainRepository { get; }
        private ISeatRepository SeatRepository { get; }

        public BookingService(
            IBookingRepository bookingRepository, 
            IUserRepository userRepository, 
            ITripRepository tripRepository, 
            ITrainRepository trainRepository, 
            ISeatRepository seatRepository)
        {
            BookingRepository = bookingRepository;
            UserRepository = userRepository;
            TripRepository = tripRepository;
            TrainRepository = trainRepository;
            SeatRepository = seatRepository;
        }

        public async Task<Booking?> GetById(string id)
        {
            var bookingEntity = await BookingRepository.GetByIdAsync(id);

            if (bookingEntity == null)
            {
                return null;
            }

            var userEntity = bookingEntity.UserId != null 
                ? await UserRepository.GetByIdAsync(bookingEntity.UserId)
                : null;

            var tripEntity = bookingEntity.TripId != null 
                ? await TripRepository.GetByIdAsync(bookingEntity.TripId)
                : null;

            var seatEntity = bookingEntity.SeatId != null 
                ? await SeatRepository.GetByIdAsync(bookingEntity.SeatId) 
                : null;

            var trainEntity = tripEntity?.TrainId != null 
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;

            return bookingEntity.ToDomain(userEntity, tripEntity, seatEntity, trainEntity);
        }

        public async Task<ImmutableList<Booking>> GetAllAsync()
        {
            var bookingEntities = await BookingRepository.GetAllAsync();

            var tasks = bookingEntities.Select(bookingEntity => GetById(bookingEntity.Id));

            var results = await Task.WhenAll(tasks);

            return results.ToImmutableList();
        }

        public async Task<Booking?> AddAsync(Booking booking)
        {
            var bookingEntity = BookingEntity.FromDomain(booking);
            await BookingRepository.AddAsync(bookingEntity);
            var userEntity = bookingEntity.UserId != null
                ? await UserRepository.GetByIdAsync(bookingEntity.UserId)
                : null;

            var tripEntity = bookingEntity.TripId != null
                ? await TripRepository.GetByIdAsync(bookingEntity.TripId)
                : null;

            var seatEntity = bookingEntity.SeatId != null
                ? await SeatRepository.GetByIdAsync(bookingEntity.SeatId)
                : null;

            var trainEntity = tripEntity?.TrainId != null
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;
            return bookingEntity.ToDomain(userEntity, tripEntity, seatEntity, trainEntity);
        }

        public async Task<Booking?> UpdateAsync(string id, Booking booking)
        {
            var bookingEntity = BookingEntity.FromDomain(booking);
            await BookingRepository.UpdateAsync(id, bookingEntity);
            var userEntity = bookingEntity.UserId != null
                ? await UserRepository.GetByIdAsync(bookingEntity.UserId)
                : null;

            var tripEntity = bookingEntity.TripId != null
                ? await TripRepository.GetByIdAsync(bookingEntity.TripId)
                : null;

            var seatEntity = bookingEntity.SeatId != null
                ? await SeatRepository.GetByIdAsync(bookingEntity.SeatId)
                : null;

            var trainEntity = tripEntity?.TrainId != null
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;
            return bookingEntity.ToDomain(userEntity, tripEntity, seatEntity, trainEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await BookingRepository.DeleteAsync(id);
        }
    }
}
