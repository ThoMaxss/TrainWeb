using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TrainWeb.Application.DTOs;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enums;
using TrainWeb.Infrastructure.Data;
using TrainWeb.Infrastructure.Settings;

namespace TrainWeb.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly ApplicationDbContext _context;

        public AuthService(JwtSettings jwtSettings, ApplicationDbContext context)
        {
            _jwtSettings = jwtSettings;
            _context = context;
        }

        public async Task<AuthResponse> Login(AuthRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            if (!user.IsActive)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Account is inactive"
                };
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                UserRole = user.UserRole.ToString()
            };

            var token = GenerateToken(userDto);

            return new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponse> Register(RegisterRequest request)
        {
            if (request.Password != request.ConfirmPassword)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Passwords do not match"
                };
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Email already registered"
                };
            }

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = HashPassword(request.Password),
                UserRole = UserRole.Customer,
                IsActive = true,
                IsEmailVerified = false,
                IsPhoneVerified = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                UserRole = user.UserRole.ToString()
            };

            var token = GenerateToken(userDto);

            return new AuthResponse
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = userDto
            };
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            var computedHash = HashPassword(password);
            return computedHash == hash;
        }

        public Task<bool> ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        public string GenerateToken(UserDto user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new System.Security.Claims.Claim("id", user.Id.ToString()),
                    new System.Security.Claims.Claim("email", user.Email ?? ""),
                    new System.Security.Claims.Claim("role", user.UserRole.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
