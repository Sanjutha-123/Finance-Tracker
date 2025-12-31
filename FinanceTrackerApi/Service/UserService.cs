using FinanceTrackerApi.Models;


namespace FinanceTrackerApi.Data
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Register user
        public string RegisterUser(string username, string email, string hashedPassword)
        {
            email = email.Trim().ToLower();

            if (_context.Users.Any(u => u.Email == email))
                return "Email already exists";

            var user = new User
            {
                Username = username,
                Email = email,
                Password = hashedPassword,
                CreatedAt = DateTime.UtcNow 
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return "User registered successfully";
        }

        // Validate login
        public bool ValidateUserCredentials(string email, string password, out User? user)
        {
            email = email.Trim().ToLower();

            user = _context.Users.FirstOrDefault(u => u.Email == email);

      if (user != null)
{
      user.CreatedAt = user.CreatedAt.ToLocalTime();
}

            
      if (user == null) return false;

        

 // Compare hashed password
           return BCrypt.Net.BCrypt.Verify(password, user.Password);
           
 }

        // Save hashed refresh token
        public void SaveRefreshToken(int userId, string refreshToken, DateTime expiry)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return;

            // Hash the refresh token before saving
            user.RefreshToken = BCrypt.Net.BCrypt.HashPassword(refreshToken);
            user.RefreshTokenExpiry = expiry;

            _context.SaveChanges();
        }

        // Optional: verify refresh token
        public bool VerifyRefreshToken(int userId, string refreshToken)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null || string.IsNullOrEmpty(user.RefreshToken)) return false;

            return BCrypt.Net.BCrypt.Verify(refreshToken, user.RefreshToken) &&
                   user.RefreshTokenExpiry > DateTime.UtcNow;
        }
    }
}