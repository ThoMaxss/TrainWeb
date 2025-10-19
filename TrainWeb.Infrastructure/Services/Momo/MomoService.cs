using System.Text;
using System.Text.Json;
using TrainWeb.Domain.Domain;
using Microsoft.Extensions.Configuration;
using TrainWeb.Infrastructure.Repositories;
using static Google.Cloud.Firestore.V1.StructuredAggregationQuery.Types.Aggregation.Types;
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

namespace TrainWeb.Infrastructure.Services.Momo
{
    public class MomoService
    {
        private IConfiguration Configuration { get; }
        public MomoService(IConfiguration configuration) 
        {
            Configuration = configuration;
        }
        public async Task<MomoPaymentResponse> CreateMomoPaymentAsync(Payment payment)
        {
            var endpoint = Configuration["Momo:Endpoint"];
            var partnerCode = Configuration["Momo:PartnerCode"];
            var accessKey = Configuration["Momo:AccessKey"];
            var secretKey = Configuration["Momo:SecretKey"];
            var requestId = Guid.NewGuid().ToString();
            var amount = payment.Amount.ToString();
            var redirectUrl = Configuration["Momo:RedirectUrl"]; //Thay bằng URL của FE // Chạy lệnh 'ngrok http https://localhost:7128' khi chạy local
            var ipnUrl = Configuration["Momo:IpnUrl"]; // Chạy lệnh 'ngrok http https://localhost:7128' khi chạy local
            var orderInfo = "Thanh toán vé tàu";
            var requestType = "captureWallet";
            var language = "vi";
            var extraData = "";
            // Chuỗi để ký (phải đúng thứ tự tham số)
            var rawHash = $"accessKey={accessKey}" +
                $"&amount={amount}" +
                $"&extraData={extraData}" +
                $"&ipnUrl={ipnUrl}" +
                $"&orderId={payment.Id!.ToString()}" +
                $"&orderInfo={orderInfo}" +
                $"&partnerCode={partnerCode}" +
                $"&redirectUrl={redirectUrl}" +
                $"&requestId={requestId}" +
                $"&requestType={requestType}";
            var signature = MomoHelper.CreateSignature(rawHash, secretKey);

            var paymentRequest = new
            {
                partnerCode,
                partnerName = "MoMo Sandbox",
                storeId = "TestStore",
                requestId,
                amount,
                orderId = payment.Id,
                orderInfo,
                redirectUrl,
                ipnUrl,
                language,
                extraData,
                requestType,
                signature
            };

            using var httpClient = new HttpClient();
            var json = JsonSerializer.Serialize(paymentRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(endpoint, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<MomoPaymentResponse>(responseContent);
        }
    }
}
