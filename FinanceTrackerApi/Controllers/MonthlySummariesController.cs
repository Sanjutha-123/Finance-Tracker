using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceTrackerApi.Data;
using System.Security.Claims;

namespace FinanceTrackerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonthlySummaryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MonthlySummaryController(ApplicationDbContext context)
        {
            _context = context;
        }
// Helper to get logged-in user id
        private int GetUserIdFromToken()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim == null ? 0 : int.Parse(claim.Value);
        }

        // GET: /api/monthlysummary?year=2025&month=12
        [HttpGet]
        public async Task<IActionResult> GetMonthlySummary(int year, int month)
        {
            int userId = GetUserIdFromToken();
            if (userId == 0) return Unauthorized();

            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1);

            var transactions = await _context.Transactions
                .Where(t =>
                    t.UserId == userId &&
                    t.Datetime >= startDate &&
                    t.Datetime < endDate)
                .ToListAsync();

            var totalIncome = transactions
                .Where(t => t.Type.ToLower() == "income")
                .Sum(t => t.Amount);

            var totalExpense = transactions
                .Where(t => t.Type.ToLower() == "expense")
                .Sum(t => t.Amount);

            var summary = new
            {
                userId,
                year,
                month,
                totalIncome,
                totalExpense,
                balance = totalIncome - totalExpense
            };

            return Ok(summary);
        }
    }
}
