using FinanceTrackerApi.Models;

namespace FinanceTrackerApi.Service
{
    public interface IMonthlySummaryService
    {
        Task<MonthlySummary> GenerateMonthlySummary(int userId, int year, int month);
    }
}
