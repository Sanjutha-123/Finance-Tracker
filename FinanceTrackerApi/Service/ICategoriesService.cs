using FinanceTrackerApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinanceTrackerApi.Service
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category> AddCategoryAsync(Category category);
        Task<Category?> GetCategoryByIdAsync(int id);
        
        Task SeedCategoriesAsync();
    }
}
