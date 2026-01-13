using FinanceTrackerApi.Models;

public interface ITransactionService
{
    Task<Transaction> AddTransaction(TransactionDto dto, int userId);
 Task<PagedResult<Transaction>> GetPagedByUserAsync(
        int userId,
        int pageNumber,
        int pageSize,
        string? sortBy,
        string? sortDirection
    );
    Task<Transaction?> GetByIdAsync(int id, int userId);
    Task<bool> UpdateTransaction(int id, TransactionDto dto, int userId);
    Task<bool> DeleteTransaction(int id, int userId);
    Task<IEnumerable<Transaction>> Filter(int userId, DateTime? start, DateTime? end, int? categoryId, string? type);
}