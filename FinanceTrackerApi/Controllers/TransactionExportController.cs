using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using FinanceTrackerApi.Data;


namespace FinanceTrackerApi.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionExportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionExportController(ApplicationDbContext context)
        {
            _context = context;
        }
[HttpGet("export-csv")]
public async Task<IActionResult> ExportTransactionsCsv()
{
    // Get userId from JWT claim
    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
    if (userIdClaim == null)
        return Unauthorized("User ID not found in token");

    int userId = int.Parse(userIdClaim.Value);

    var transactions = await _context.Transactions
        .Where(t => t.UserId == userId)
        .OrderBy(t => t.Datetime)
        .ToListAsync();

    if (!transactions.Any())
        return NotFound("No transactions found");

    var csv = new StringBuilder();
    csv.AppendLine("Id,Type,Amount,Category,Date");

    foreach (var t in transactions)
    {
        csv.AppendLine($"{t.Id},{t.Type},{t.Amount},{t.CategoryId},{t.Datetime:yyyy-MM-dd}");
    }

    byte[] bytes = Encoding.UTF8.GetBytes(csv.ToString());

    return File(bytes, "text/csv", $"transactions_user_{userId}.csv");
}
    }
    }