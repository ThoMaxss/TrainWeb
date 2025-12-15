using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using FirebaseAdmin.Auth;
using System;
using System.Threading.Tasks;

namespace TrainWeb.Infrastructure.Services
{
    public class FirebaseService
    {
        public FirebaseService()
        {
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("D:\\TrainWeb\\TrainWeb\\TrainWebAPI\\firebase-key.json")
            });
        }

        public async Task<string?> CreateUserAsync(string email, string password)
        {
            try
            {
                var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(new UserRecordArgs()
                {
                    Email = email,
                    Password = password
                });

                return userRecord.Uid;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return null;
            }
        }

        public async Task<FirebaseToken?> VerifyIdTokenAsync(string idToken)
        {
            try
            {
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                return decodedToken;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token verification failed: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> VerifyEmailAsync(string email)
        {
            try
            {
                var user = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
                return user.EmailVerified;
            }
            catch (FirebaseAuthException)
            {
                return false;
            }
        }

        public async Task SendEmailVerificationAsync(string email)
        {
            try
            {
                var user = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
                var link = await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(email);
                Console.WriteLine($"Verification link: {link}");

                await SendEmailAsync(email, "Xác thực tài khoản", $"Vui lòng nhấp vào liên kết để xác thực tài khoản của bạn: {link}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email verification: {ex.Message}");
            }
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpClient = new System.Net.Mail.SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new System.Net.NetworkCredential("your-email@gmail.com", "your-email-password"),
                EnableSsl = true,
            };

            var mailMessage = new System.Net.Mail.MailMessage
            {
                From = new System.Net.Mail.MailAddress("your-email@gmail.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
