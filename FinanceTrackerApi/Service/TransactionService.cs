using FinanceTrackerApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;






namespace FinanceTrackerApi.Data
{
    public class TransactionService: ITransactionService
    {
        private readonly ApplicationDbContext _context;

        public TransactionService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ---------------------- CREATE ----------------------
        public Transaction AddTransaction(Transaction transaction)
        {
            // VALIDATE TYPE → only income or expense allowed
         if (string.IsNullOrWhiteSpace(transaction.Type) || 
    !(transaction.Type.ToLower() == "income" || transaction.Type.ToLower() == "expense"))
{
    throw new ArgumentException("Type must be 'income' or 'expense'");
}


            transaction.Datetime2 = DateTime.Now;

            // If frontend accidentally sends User object
            if (transaction.User != null)
            {
                var existingUser = _context.Users
                    .FirstOrDefault(u => u.Email == transaction.User.Email);

                if (existingUser != null)
                {
                    transaction.UserId = existingUser.Id;
                    transaction.User = null;
                }
            }

            _context.Transactions.Add(transaction);
            _context.SaveChanges();
            return transaction;
        }

        // ---------------------- READ ----------------------
        //  Get paginated transactions
   public async Task<FinanceTrackerApi.Models.PagedResult<Transaction>> GetPagedAsync(
    int pageNumber,
    int pageSize,
    string? sortBy = "Datetime2",
    string? sortDirection = "desc")
{
    var query = _context.Transactions.AsQueryable().AsNoTracking();

    // Default safe sorting
    sortBy = string.IsNullOrWhiteSpace(sortBy) ? "Datetime2" : sortBy;
    sortDirection = sortDirection?.ToLower() == "asc" ? "asc" : "desc";

    string sortExpression = $"{sortBy} {sortDirection}";

    // Dynamic sorting
    query = query.OrderBy(sortExpression);

    var totalRecords = await query.CountAsync();

    var data = await query
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
            .Select(t => new Transaction
    {
        Id = t.Id,
        Amount = t.Amount,
        Datetime2 = t.Datetime2,
        Type = t.Type,
        Category = t.Category
    })

        .ToListAsync();

    return new FinanceTrackerApi.Models.PagedResult<Transaction>
    {
        TotalRecords = totalRecords,
        PageNumber = pageNumber,
        PageSize = pageSize,
        Data = data
    };
}


        //  Get a single transaction by ID
        public async Task<Transaction?> GetByIdAsync(int id)
        {
            return await _context.Transactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

 // ---------------------- UPDATE ----------------------
        public bool UpdateTransaction(int id, Transaction updated)
        {
            var existing = _context.Transactions.FirstOrDefault(t => t.Id == id);
            if (existing == null)
                return false;

           // VALIDATE TYPE
if (string.IsNullOrWhiteSpace(updated.Type) || 
    !(updated.Type.ToLower() == "income" || updated.Type.ToLower() == "expense"))
{
    throw new ArgumentException("Type must be 'income' or 'expense'");
}


            existing.Amount = updated.Amount;
            existing.Type = updated.Type;
            existing.Category = updated.Category;
            existing.Description = updated.Description;
            existing.Datetime2 = updated.Datetime2;

            _context.SaveChanges();
            return true;
        }

        // ---------------------- DELETE ----------------------
        public bool DeleteTransaction(int id)
        {
            var t = _context.Transactions.FirstOrDefault(x => x.Id == id);
            if (t == null) return false;

            _context.Transactions.Remove(t);
            _context.SaveChanges();
            return true;
        }

        // ---------------------- FILTER ----------------------

    public async Task<List<Transaction>> Filter(
    int userId,
    DateTime? start,
    DateTime? end,
    string? category,
    string? type)
{
    var query = _context.Transactions.AsQueryable();

    query = query.Where(t => t.UserId == userId);

    if (start.HasValue)
        query = query.Where(t => t.Datetime2 >= start.Value);

    if (end.HasValue)
        query = query.Where(t => t.Datetime2 <= end.Value);

    if (!string.IsNullOrEmpty(category))
        query = query.Where(t => t.Category == category);

   if (!string.IsNullOrEmpty(type))
{
    if (type.ToLower() == "income")
        query = query.Where(t => t.Type.ToLower() == "income");
    else if (type.ToLower() == "expense")
        query = query.Where(t => t.Type.ToLower() == "expense");
}


    return await query.ToListAsync();
}
    }

}