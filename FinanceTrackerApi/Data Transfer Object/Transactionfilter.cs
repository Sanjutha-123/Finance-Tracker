namespace FinanceTrackerApi.Models
{
    public class TransactionFilterDto
    {
        public int UserId { get; set; }
        public DateTime? Start { get; set; }   // Optional start date
        public DateTime? End { get; set; }     // Optional end date
        public string? Category { get; set; }  // Optional category
        public  string? Type { get; set; }      // Optional type ("income"/"expense")
    }
}