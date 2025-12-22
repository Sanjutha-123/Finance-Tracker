using FinanceTrackerApi.Models;
using FinanceTrackerApi.Dtos;

namespace FinanceTrackerApi.Services
{
    public interface ICategoryService
    {
        Task<Category> CreateAsync(CategoryDto dto);
        
        Task<Category?> UpdateAsync(int id, CategoryDto dto);
        Task<bool> DeleteAsync(int id);
    }
}