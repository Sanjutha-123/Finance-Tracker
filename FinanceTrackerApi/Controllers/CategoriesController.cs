using FinanceTrackerApi.Models;
using FinanceTrackerApi.Service;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FinanceTrackerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

public CategoryController(ICategoryService service)
{
    _service = service;
}
        // ---------------------- GET ALL CATEGORIES ----------------------
        // GET: /api/category
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _service.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // ---------------------- GET CATEGORY BY ID ----------------------
        // GET: /api/category/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _service.GetCategoryByIdAsync(id);
            if (category == null)
                return NotFound(new { message = $"Category with ID {id} not found" });

            return Ok(category);
        }

        // ---------------------- ADD CATEGORY ----------------------
        // POST: /api/category/add
        [HttpPost("add")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (string.IsNullOrWhiteSpace(category.Name))
                return BadRequest(new { message = "Category name is required" });

            var addedCategory = await _service.AddCategoryAsync(category);
            return Ok(addedCategory);
        }
    }
}






   
