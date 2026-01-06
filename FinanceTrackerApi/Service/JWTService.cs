using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FinanceTrackerApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace FinanceTrackerApi.Service
{
    public class JwtService : IJwtService
    {
        private readonly string _issuer;
        private readonly string _audience;
        private readonly string _accessSecret;
        private readonly string _refreshSecret;
        private readonly int _accessMinutes;
        private readonly int _refreshDays;

        public JwtService(IConfiguration config)
        {
            var jwtCfg = config.GetSection("JwtSettings");
            _issuer = jwtCfg.GetValue<string>("Issuer")!;
            _audience = jwtCfg.GetValue<string>("Audience")!;
            _accessSecret = jwtCfg.GetValue<string>("AccessTokenSecret")!;
            _refreshSecret = jwtCfg.GetValue<string>("RefreshTokenSecret")!;
            _accessMinutes = jwtCfg.GetValue<int>("AccessTokenExpirationMinutes");
            _refreshDays = jwtCfg.GetValue<int>("RefreshTokenExpirationDays");
        }

        public TokenResponse GenerateTokens(User user)
        {
            var accessToken = CreateAccessToken(user);
            var refreshToken = GenerateRefreshToken();

            return new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresInMinutes = _accessMinutes
            };
        }

        private string CreateAccessToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_accessSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            //  Use "id" claim so controller can extract userId
            var claims = new[]
            {
                new Claim("id", user.Id.ToString()),       // user id
                new Claim(ClaimTypes.Name, user.Username) // username
            };

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_accessMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        // Create a cryptographically secure random refresh token (opaque)
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public ClaimsPrincipal? ValidateRefreshToken(string token, bool validateLifetime = true)
        {
          
            return null;
        }
    }
}