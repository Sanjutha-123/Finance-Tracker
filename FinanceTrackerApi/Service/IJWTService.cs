using System.Security.Claims;
using FinanceTrackerApi.Models;

namespace FinanceTrackerApi.Service
{
    public interface IJwtService
    {
        TokenResponse GenerateTokens(User user);
        ClaimsPrincipal? ValidateRefreshToken(string token, bool validateLifetime = true);
        string GenerateRefreshToken();
    }
}