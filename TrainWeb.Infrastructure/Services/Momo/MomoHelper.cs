using System.Security.Cryptography;
using System.Text;

namespace TrainWeb.Infrastructure.Repositories;
public static class MomoHelper
{
    public static string CreateSignature(string rawData, string secretKey)
    {
        var encoding = new UTF8Encoding();
        byte[] keyByte = encoding.GetBytes(secretKey);
        byte[] messageBytes = encoding.GetBytes(rawData);
        using (var hmacsha256 = new HMACSHA256(keyByte))
        {
            byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
            return BitConverter.ToString(hashmessage).Replace("-", "").ToLower();
        }
    }
}
