namespace FinanceTrackerApi.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = null!;
        public int CategoryId { get; set; } 
        public string? Description { get; set; }
        public DateTime Datetime { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int UserId { get; set; }
        public User? User { get; set; }  // Navigation property
    }
}
