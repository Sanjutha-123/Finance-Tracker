using FinanceTrackerApi.Models;

namespace FinanceTrackerApi.Data
{
    public interface ITransactionService
    {
        Transaction AddTransaction(Transaction transaction);

        Task<PagedResult<Transaction>> GetPagedAsync(
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortDirection
        );

        Task<Transaction?> GetByIdAsync(int id);

        bool UpdateTransaction(int id, Transaction updated);

        bool DeleteTransaction(int id);

        Task<List<Transaction>> Filter(
            int userId,
            DateTime? start,
            DateTime? end,
            string? category,
            string? type
        );
    }
}
