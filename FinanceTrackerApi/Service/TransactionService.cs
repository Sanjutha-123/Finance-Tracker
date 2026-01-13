using FinanceTrackerApi.Models;
using FinanceTrackerApi.Service;
using Microsoft.EntityFrameworkCore;

namespace FinanceTrackerApi.Data
{
    public class TransactionService : ITransactionService
    {
        private readonly ApplicationDbContext _context;

        public TransactionService(ApplicationDbContext context)
        {
            _context = context;
        }

      public async Task<Transaction> AddTransaction(TransactionDto dto, int userId)
{
    // Check if category exists
    var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
    if (!categoryExists)
        throw new Exception("Category not found");

    var transaction = new Transaction
    {
        Amount = dto.Amount,
        Type = dto.Type.ToLower(),
        CategoryId = dto.CategoryId,
        Description = dto.Description,
        Datetime = dto.Datetime ?? DateTime.UtcNow,
        UserId = userId
    };

    _context.Transactions.Add(transaction);
    await _context.SaveChangesAsync();
    return transaction;
}

     public async Task<PagedResult<Transaction>> GetPagedByUserAsync(
    int userId,
    int pageNumber,
    int pageSize,
    string? sortBy,
    string? sortDirection)
{
    var query = _context.Transactions
        .Where(t => t.UserId == userId);

    // ✅ SORTING
    if (!string.IsNullOrWhiteSpace(sortBy))
    {
        if (sortDirection?.ToLower() == "asc")
            query = query.OrderBy(t => EF.Property<object>(t, sortBy));
        else
            query = query.OrderByDescending(t => EF.Property<object>(t, sortBy));
    }
    else
    {
        // Default sort
        query = query.OrderByDescending(t => t.Datetime);
    }

    // ✅ TOTAL COUNT
    var totalItems = await query.CountAsync();

    // ✅ PAGINATION
    var items = await query
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PagedResult<Transaction>
    {
        Items = items,
        PageNumber = pageNumber,
        PageSize = pageSize,
        TotalItems = totalItems,
        TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
    };
}


        public async Task<Transaction?> GetByIdAsync(int id, int userId)
        {
            return await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<bool> UpdateTransaction(int id, TransactionDto dto, int userId)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (transaction == null) return false;

            transaction.Amount = dto.Amount;
            transaction.Type = dto.Type.ToLower();
            transaction.CategoryId = dto.CategoryId;
            transaction.Description = dto.Description;
            transaction.Datetime = dto.Datetime ?? transaction.Datetime;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTransaction(int id, int userId)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (transaction == null) return false;

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Transaction>> Filter(int userId, DateTime? start, DateTime? end, int? categoryId, string? type)
        {
            var query = _context.Transactions.AsQueryable();
            query = query.Where(t => t.UserId == userId);

            if (start.HasValue)
                query = query.Where(t => t.Datetime >= start.Value);
            if (end.HasValue)
                query = query.Where(t => t.Datetime <= end.Value);
            if (categoryId.HasValue)
                query = query.Where(t => t.CategoryId == categoryId.Value);
            if (!string.IsNullOrEmpty(type))
                query = query.Where(t => t.Type.ToLower() == type.ToLower());

            return await query.ToListAsync();
        }

    
    }
}