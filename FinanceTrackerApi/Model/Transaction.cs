
namespace FinanceTrackerApi.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }       // Foreign key
        public User? User { get; set; }       // Navigation property
        public decimal Amount { get; set; }

        // Change from enum to string

        public string Type { get; set; } = string.Empty; // Allowed values: "income", "expense"

        public string? Category { get; set; }
        public string? Description { get; set; }
        public DateTime Datetime2 { get; set; } = DateTime.UtcNow;
        internal class TransactionType
        {
        }
    }
}