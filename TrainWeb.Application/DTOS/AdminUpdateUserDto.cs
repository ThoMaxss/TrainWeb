namespace TrainWeb.Application.DTOS
{
    public sealed class AdminUpdateUserDto
    {
        public string? Name { get; set; }
        public string? CCCD { get; set; }
        public string? Phone { get; set; }
        public string? AvatarURL { get; set; }

        // admin mới được sửa
        public string? Role { get; set; } // "passenger" | "staff" | "admin"
    }
}
