namespace TrainWeb.Domain.Exceptions
{
    public class BadRequestException : HttpResponseException
    {
        public BadRequestException(string message)
            : base(StatusCodeConstants.BadRequest, message) { }
    }
}
