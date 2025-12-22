namespace FinanceTrackerApi.Models
{
    public class Category
    {

        public int Id { get; set; }
    
        public string Name { get; set; } = string.Empty;

        public required string Type { get; set; }
        
    }
}