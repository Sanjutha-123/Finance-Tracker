namespace FinanceTrackerApi.Models
{
    public class User
    {
        public int Id { get; set; } // or Guid
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? RefreshToken { get; set; }           // store current refresh token
        public DateTime? RefreshTokenExpiry { get; set; }  // optional expiry tracking
        public DateTime CreatedAt { get; internal set; }
    }
}
