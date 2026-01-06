using FinanceTrackerApi.Data;
using FinanceTrackerApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinanceTrackerApi.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all categories
        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        // Add new category
        public async Task<Category> AddCategoryAsync(Category category)
        {
            var newCategory = new Category
       {
             Name = category.Name,
             Type = category.Type // include the type
       };
             _context.Categories.Add(newCategory); 
             await _context.SaveChangesAsync();
             return newCategory;
        }

        // Get category by ID
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }
public async Task<bool> DeleteCategoryAsync(int id)
{
    var category = await _context.Categories.FindAsync(id);

    if (category == null)
        return false;

    _context.Categories.Remove(category);
    await _context.SaveChangesAsync();

    return true;
}

    public async Task SeedCategoriesAsync()
        {
            if (await _context.Categories.AnyAsync()) return; // Already seeded

            var categories = new List<Category>
            {
        new Category { Name = "Food", Type = "Expense" },
        new Category { Name = "Transport", Type = "Expense" },
        new Category { Name = "Entertainment", Type = "Expense" },
        new Category { Name = "Shopping", Type = "Expense" },
        new Category { Name = "Health", Type = "Expense" },
        new Category { Name = "Utilities", Type = "Expense" },
        new Category { Name = "Education", Type = "Expense" },
        new Category { Name = "Freelance", Type = "Income" },
        new Category { Name = "Salary", Type = "Income" },
        new Category { Name = "Miscellaneous", Type = "Expense" }

            };

            _context.Categories.AddRange(categories);
            await _context.SaveChangesAsync();
        }
    }
}