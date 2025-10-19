namespace TrainWeb.Infrastructure.Services.Momo
{
    public class MomoPaymentResponse
    {
        public string payUrl { get; set; }
        public string deeplink { get; set; }
        public string qrCodeUrl { get; set; }
        public string requestId { get; set; }
        public string orderId { get; set; }
        public int resultCode { get; set; }
        public string message { get; set; }
    }

}
