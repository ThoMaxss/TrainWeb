namespace TrainWeb.Domain.Exceptions
{
    public abstract class HttpResponseException : Exception
    {
        public int StatusCode { get; }

        protected HttpResponseException(int statusCode, string message) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
