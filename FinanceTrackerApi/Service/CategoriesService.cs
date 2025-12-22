using FinanceTrackerApi.Models;
using FinanceTrackerApi.Dtos;
using FinanceTrackerApi.Data;

namespace FinanceTrackerApi.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Category> CreateAsync(CategoryDto dto)
        {
            var category = new Category { Name = dto.Name, Type = dto.Type };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

         public async Task<Category?> UpdateAsync(int id, CategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null;
                    
            category.Name = dto.Name;
            category.Type = dto.Type;
          

            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}