public class TransactionDto
{
    public decimal Amount { get; set; }
    public string Type { get; set; } = null!;   // "income" or "expense"
    public int CategoryId { get; set; }        // dropdown selection
    public string? Description { get; set; }
    public DateTime? Datetime { get; set; }    // optional
}
