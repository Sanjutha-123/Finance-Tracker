using FinanceTrackerApi.Models;
using FinanceTrackerApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace FinanceTrackerApi.Service
{
    public class MonthlySummaryService : IMonthlySummaryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;

        public MonthlySummaryService(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<MonthlySummary> GenerateMonthlySummary(int userId, int year, int month)
        {
            var cacheKey = $"monthlySummary_{userId}_{year}_{month}";

            if (!_cache.TryGetValue(cacheKey, out MonthlySummary summary))
            {
                // 1️⃣ Fetch transactions for the month
                var startDate = new DateTime(year, month, 1);
                var endDate = startDate.AddMonths(1);

                var transactions = await _context.Transactions
                    .Where(t => t.UserId == userId && t.Datetime >= startDate && t.Datetime < endDate)
                    .ToListAsync();

                // 2️⃣ Calculate totals
                var totalIncome = transactions.Where(t => t.Type.ToLower() == "income").Sum(t => t.Amount);
                var totalExpense = transactions.Where(t => t.Type.ToLower() == "expense").Sum(t => t.Amount);

                // 3️⃣ Create summary object
                summary = new MonthlySummary
                {
                    UserId = userId,
                    Year = year,
                    Month = month,
                    TotalIncome = totalIncome,
                    TotalExpense = totalExpense,
                    Balance = totalIncome - totalExpense
                };

                // 4️⃣ Save to DB (optional)
                _context.MonthlySummaries.Add(summary);
                await _context.SaveChangesAsync();

                // 5️⃣ Cache for 10 minutes
                _cache.Set(cacheKey, summary, TimeSpan.FromMinutes(10));
            }

            return summary;
        }
    }
}
