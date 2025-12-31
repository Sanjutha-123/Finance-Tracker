namespace FinanceTrackerApi.Models
{
    public class MonthlySummary
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal Balance { get; set; }
    }
}
