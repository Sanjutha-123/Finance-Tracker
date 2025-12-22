using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceTrackerApi.Data;

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

        [HttpGet]
        public async Task<IActionResult> GetMonthlySummary(
        int userId,
        int year,
        int month)
{
    var startDate = new DateTime(year, month, 1);
    var endDate = startDate.AddMonths(1);

    var transactions = await _context.Transactions
        .Where(t =>
            t.UserId == userId &&
            t.Datetime2 >= startDate &&
            t.Datetime2 < endDate)
        .ToListAsync();

   var totalIncome = transactions
    .Where(t => t.Type.ToLower() == "income")
    .Sum(t => t.Amount);

   var totalExpense = transactions
    .Where(t => t.Type.ToLower() == "expense")
    .Sum(t => t.Amount);

    return Ok(new
    {
        userId,
        year,
        month,
        totalIncome,
        totalExpense,
        balance = totalIncome - totalExpense
    });
}
    }
}