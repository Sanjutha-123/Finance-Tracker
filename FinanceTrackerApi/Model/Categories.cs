namespace FinanceTrackerApi.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public required string Type { get; set; }


    }
}
