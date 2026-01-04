# TrainWeb Backend - .NET 10 Clean Architecture

## Project Structure

```
TrainWeb.API/              - ASP.NET Core Web API entry point
TrainWeb.Application/      - Business logic & DTOs  
TrainWeb.Domain/           - Domain entities
TrainWeb.Infrastructure/   - Data access, auth, services
```

## Features

✅ **JWT Authentication** - Secure token-based auth
✅ **SQL Server Integration** - EF Core ORM with migrations
✅ **CORS Enabled** - Frontend integration ready
✅ **Clean Architecture** - Scalable & maintainable structure
✅ **Dependency Injection** - Built-in DI container
✅ **Entity Framework Core** - Database migrations

## Prerequisites

- .NET 10 SDK
- SQL Server (Local or Remote)
- Visual Studio Code / Visual Studio

## Getting Started

### 1. Configure Database Connection

Edit `TrainWeb.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=TrainWebDb;Trusted_Connection=true;Encrypt=false;"
}
```

### 2. Create Database

```powershell
cd TrainWeb.API
dotnet ef database update
```

### 3. Run the API

```powershell
cd TrainWeb.API
dotnet run
```

API will be available at: `https://localhost:5001` or `http://localhost:5000`

## API Endpoints

### Authentication

- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/validate` - Token validation

### Database Schema

#### Users Table
- Id (GUID)
- Email (Unique)
- FullName
- PasswordHash
- PhoneNumber
- UserRole (Admin, Staff, User)
- ProfilePicture
- IsActive
- CreatedAt, UpdatedAt

#### Trains Table
- Id (GUID)
- TrainNumber (Unique)
- TrainName
- TotalSeats
- AvailableSeats
- TrainType
- IsActive
- CreatedAt, UpdatedAt

#### Tickets Table
- Id (GUID)
- UserId (FK)
- TrainId (FK)
- TicketNumber (Unique)
- SeatNumber
- JourneyDate
- DepartureStation
- ArrivalStation
- Price
- Status
- CreatedAt, UpdatedAt

#### Feedback Table
- Id (GUID)
- UserId (FK)
- Subject
- Message
- Rating (1-5)
- Status
- CreatedAt, UpdatedAt

## JWT Configuration

Update `JwtSettings` in `appsettings.json`:

```json
"JwtSettings": {
  "Secret": "your-super-secret-key-min-32-chars",
  "Issuer": "TrainWebAPI",
  "Audience": "TrainWebClient",
  "ExpirationMinutes": 1440
}
```

⚠️ **IMPORTANT**: Change the `Secret` in production to a strong key!

## CORS Configuration

Frontend origins in `appsettings.json`:

```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://yourdomain.com"
  ]
}
```

## Development vs Production

- **Development**: `appsettings.Development.json` - Uses Dev database with debug logging
- **Production**: `appsettings.json` - Uses Production database with minimal logging

## Performance Optimization

- SQL Server connection pooling enabled
- Async/await throughout
- Entity Framework lazy loading optimized
- JWT token caching ready

## Build & Deploy

### Build Release
```powershell
dotnet build --configuration Release
```

### Publish
```powershell
dotnet publish -c Release -o ./publish
```

### Run Published App
```powershell
dotnet TrainWeb.API.dll
```

## Next Steps

1. ✅ Implement Login/Register with password hashing (BCrypt)
2. ✅ Create Train management endpoints
3. ✅ Create Ticket booking endpoints
4. ✅ Add Feedback endpoints
5. ✅ Implement role-based authorization
6. ✅ Add pagination, filtering, searching
7. ✅ Add caching layer (Redis)
8. ✅ Write unit tests

## Health Check

```
GET /health
```

## API Documentation

Swagger/OpenAPI available at: `/swagger` (when in Development)

## Troubleshooting

### Database Connection Error
- Check SQL Server is running
- Verify connection string
- Ensure database exists or use migrations

### Port Already in Use
```powershell
dotnet run --urls=http://localhost:5002
```

### JWT Token Issues
- Verify Secret is same on API & validation
- Check token expiration time
- Ensure CORS origins are correct

## Contributing

- Follow Clean Architecture principles
- Keep Domain clean (no external dependencies)
- Use dependency injection for services
- Write meaningful commit messages

## Support

For issues or questions about the backend setup, refer to the latest .NET documentation or create an issue.
