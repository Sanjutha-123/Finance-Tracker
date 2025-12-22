using FinanceTrackerApi.Models;
using FinanceTrackerApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace FinanceTrackerApi.Service
{
    public class MonthlySummaryService
    {    
        private readonly IMemoryCache _cache; 
        private readonly ApplicationDbContext _context;

        public MonthlySummaryService(ApplicationDbContext context)
        {
            _context = context;
        }

      public async Task<MonthlySummary> GenerateMonthlySummary(int userId, int year, int month)
{
    // 0️⃣ Create a unique cache key
    var cacheKey = $"monthlySummary_{userId}_{year}_{month}";

    // 1️⃣ Check if summary is already in cache
    if (!_cache.TryGetValue(cacheKey, out MonthlySummary summary))
    {
        // 2️⃣ Fetch transactions (existing logic)
        var transactions = await _context.Transactions
            .Where(t =>
                t.UserId == userId &&
                t.Datetime2.Year == year &&
                t.Datetime2.Month == month)
            .ToListAsync();

        // 3️⃣ Calculate totals
        decimal totalIncome = transactions
            .Where(t => t.Type.ToLower() == "income")
            .Sum(t => t.Amount);

        decimal totalExpense = transactions
            .Where(t => t.Type.ToLower() == "expense")
            .Sum(t => t.Amount);

        // 4️⃣ Create MonthlySummary entity
        summary = new MonthlySummary
        {
            UserId = userId,
            Year = year,
            Month = month,
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            Balance = totalIncome - totalExpense
        };

        // 5️⃣ Save to DB (optional)
        _context.MonthlySummaries.Add(summary);
        await _context.SaveChangesAsync();

        // 6️⃣ Store result in cache for future requests
        _cache.Set(cacheKey, summary, TimeSpan.FromMinutes(10));
    }

    // 7️⃣ Return cached or newly created summary
    return summary;
}
    }
}
