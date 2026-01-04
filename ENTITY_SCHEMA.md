# 🚂 TrainWeb Backend - Complete Entity Schema

## Completed Entities (9 total)

### 1. **User** ✅
```csharp
- Id (GUID)
- Email (unique)
- FullName
- PasswordHash
- PhoneNumber
- Address
- DateOfBirth
- Gender (Male, Female, Other)
- IdNumber (ID card / passport)
- ProfilePicture
- UserRole (0=Passenger, 1=Staff, 2=Admin)
- IsActive
- IsEmailVerified
- IsPhoneVerified
- LastLoginAt
- FailedLoginAttempts
- CreatedAt, UpdatedAt
```

### 2. **Train** ✅
```csharp
- Id (GUID)
- TrainNumber (unique)
- TrainName
- TrainType (Express, Local, Suburban)
- TotalSeats
- AvailableSeats
- HardSeats
- SoftSeats
- Manufacturer
- YearOfManufacture
- MaxSpeed (km/h)
- OperatingCompany
- Amenities (WiFi, AC, Food service)
- HasAC, HasWiFi, HasFoodService, HasToilet
- IsActive
- CreatedAt, UpdatedAt
- Navigation: Trips []
```

### 3. **Trip** ✅
```csharp
- Id (GUID)
- TrainId (FK)
- OriginStation
- DestinationStation
- TripDate
- DepartureTime
- ArrivalTime
- Duration (in minutes)
- BasePrice
- Discount
- SeatsAvailable
- TotalSeats
- Status (Active, Cancelled, Completed)
- Notes
- IsActive
- CreatedAt, UpdatedAt
- Navigation: Train, Seats [], Bookings [], Feedbacks []
```

### 4. **Seat** ✅
```csharp
- Id (GUID)
- TripId (FK)
- SeatNumber
- SeatType (0=Hard, 1=Soft)
- Price
- IsAvailable
- BookedByUserId
- BookingReference
- BookedAt
- CreatedAt, UpdatedAt
- Navigation: Trip, Tickets []
```

### 5. **Booking** ✅
```csharp
- Id (GUID)
- UserId (FK)
- TripId (FK)
- BookingReference (unique)
- Status (0=Reserved, 1=Paid, 2=Cancelled)
- NumberOfPassengers
- TotalPrice
- DiscountAmount
- TaxAmount
- FinalAmount
- PaymentId (FK)
- Notes
- PaidAt
- CancelledAt
- CancellationReason
- CreatedAt, UpdatedAt
- Navigation: User, Trip, Tickets [], Payment
```

### 6. **Ticket** ✅
```csharp
- Id (GUID)
- BookingId (FK)
- UserId (FK)
- SeatId (FK)
- TicketTypeId (FK)
- TicketNumber (unique)
- SeatNumber
- DepartureStation
- ArrivalStation
- DepartureTime
- ArrivalTime
- JourneyDate
- Price
- DiscountAmount
- SeatType (0=Hard, 1=Soft)
- Status (0=Active, 1=Used, 2=Cancelled)
- QRCode
- PassengerName
- PassengerId (ID card number)
- UsedAt
- CancelledAt
- CreatedAt, UpdatedAt
- Navigation: User, Booking, Seat, TicketType
```

### 7. **TicketType** ✅
```csharp
- Id (GUID)
- Name (e.g., "Student", "Senior", "Child")
- Description
- DiscountPercentage
- DisplayOrder
- IsActive
- CreatedAt, UpdatedAt
- Navigation: Tickets []
```

### 8. **Payment** ✅
```csharp
- Id (GUID)
- BookingId (FK, unique)
- UserId (FK)
- Amount
- Method (0=Visa, 1=Momo, 2=VnPay)
- Status (0=Success, 1=Pending, 2=Failed)
- TransactionReference
- CardLastFourDigits
- CardHolderName
- BankCode
- GatewayResponse (JSON)
- ProcessedAt
- FailureReason
- RetryCount
- IPAddress
- CreatedAt, UpdatedAt
- Navigation: Booking, User
```

### 9. **Feedback** ✅
```csharp
- Id (GUID)
- UserId (FK)
- TripId (FK, nullable)
- Subject
- Content
- Rating (1-5)
- Status (Pending, Responded, Resolved)
- ResponseMessage
- RespondedByUserId
- IsPublished
- RespondedAt
- CreatedAt, UpdatedAt
- Navigation: User, Trip
```

## Database Relationships

```
User
├── 1:N → Booking
├── 1:N → Ticket (direct)
├── 1:N → Payment
└── 1:N → Feedback

Train
└── 1:N → Trip

Trip
├── 1:N → Seat
├── 1:N → Booking
└── 1:N → Feedback

Seat
└── 1:N → Ticket

Booking
├── N:1 → User
├── N:1 → Trip
├── 1:N → Ticket
└── 1:1 → Payment

Ticket
├── N:1 → User
├── N:1 → Booking
├── N:1 → Seat
└── N:1 → TicketType

TicketType
└── 1:N → Ticket

Payment
├── N:1 → User
└── 1:1 → Booking

Feedback
├── N:1 → User
└── N:1 → Trip (optional)
```

## Key Features

✅ **Complete Authentication Fields**
- Email verification status
- Password security tracking
- Login attempt monitoring

✅ **Enhanced Train Management**
- Amenities tracking (AC, WiFi, Food)
- Seat type separation
- Performance metrics

✅ **Full Booking Workflow**
- Automatic booking reference generation
- Status tracking (Reserved → Paid → Completed)
- Discount & tax calculations
- Cancellation support

✅ **Payment Gateway Ready**
- Multiple payment methods (Visa, Momo, VnPay)
- Transaction tracing
- Retry mechanism
- Fraud detection fields (IP address)

✅ **Audit Trail**
- CreatedAt/UpdatedAt on all entities
- Status change timestamps
- Cancellation reasons & dates

## Database Constraints

✅ Unique indexes on: Email, TrainNumber, TicketNumber, BookingReference, TransactionReference
✅ Foreign key relationships with proper cascade/restrict rules
✅ NOT NULL requirements on essential fields
✅ Decimal precision configured for financial data

## Migration Status

- ✅ Migration created: `InitialCreate`
- Ready for `dotnet ef database update`

## Next: Controllers & DTOs

Tôi sẽ tạo:
1. DTOs cho tất cả entities (mapping with AutoMapper)
2. Controllers cho: Auth, User, Train, Trip, Booking, Ticket, Payment, Feedback
3. Services layer
4. Repository pattern (nếu cần)
5. API documentation (Swagger)

---

**Build Status**: ✅ Success (20 warnings - all nullable property warnings)
**Database Target**: SQL Server (local or remote)
**ORM**: Entity Framework Core 10.0.1
**Framework**: .NET 10
