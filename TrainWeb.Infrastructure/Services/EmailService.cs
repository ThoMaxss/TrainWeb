using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendVerificationEmailAsync(string email, string verificationUrl)
    {
        try
        {
            var message = new MimeMessage();

            message.From.Add(new MailboxAddress(
                _configuration["Email:FromName"],
                _configuration["Email:FromAddress"]
            ));

            message.To.Add(new MailboxAddress(email, email));

            message.Subject = "Verify your email address";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <h2>Email Verification</h2>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href='{verificationUrl}' style='padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;'>
                        Verify Email
                    </a>
                    <p>Or copy this link: {verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(
                    _configuration["Email:SmtpServer"],
                    int.Parse(_configuration["Email:SmtpPort"]),
                    SecureSocketOptions.StartTls
                );

                await client.AuthenticateAsync(
                    _configuration["Email:Username"],
                    _configuration["Email:Password"]
                );

                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to send verification email to {email}", ex);
        }
    }
}