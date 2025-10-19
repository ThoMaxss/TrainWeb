namespace TrainWeb.Domain.Exceptions
{
    public class NotFoundException : HttpResponseException
    {
        public NotFoundException(string message)
            : base(StatusCodeConstants.NotFound, message) { }
    }
}
