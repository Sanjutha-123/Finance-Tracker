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
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        // Get category by ID
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }

    public async Task SeedCategoriesAsync()
        {
            if (await _context.Categories.AnyAsync()) return; // Already seeded

            var categories = new List<Category>
            {
                new Category { Name = "Food" },
                new Category { Name = "Transport" },
                new Category { Name = "Entertainment" },
                new Category { Name = "Shopping" },
                new Category { Name = "Health" },
                new Category { Name = "Utilities" },
                new Category { Name = "Education" },
                new Category { Name = "Freelance" },
                new Category { Name = "Salary" },
                new Category { Name = "Miscellaneous" }
            };

            _context.Categories.AddRange(categories);
            await _context.SaveChangesAsync();
        }
    }
}