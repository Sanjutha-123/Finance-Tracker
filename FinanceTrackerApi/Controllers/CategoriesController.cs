using FinanceTrackerApi.Models;
using FinanceTrackerApi.Service;
using Microsoft.AspNetCore.Mvc;


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
     
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _service.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // ---------------------- GET CATEGORY BY ID ----------------------
       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _service.GetCategoryByIdAsync(id);
            if (category == null)
                return NotFound(new { message = $"Category with ID {id} not found" });

            return Ok(category);
        }

        // ---------------------- ADD CATEGORY ----------------------
       
        [HttpPost("add")]
public async Task<IActionResult> AddCategory([FromBody] Category category)
{
    if (string.IsNullOrWhiteSpace(category.Name))
        return BadRequest(new { message = "Category name is required" });
    if (string.IsNullOrWhiteSpace(category.Type) || 
       !(category.Type.Equals("Income", StringComparison.OrdinalIgnoreCase) ||
       category.Type.Equals("Expense", StringComparison.OrdinalIgnoreCase)))
       category.Type = char.ToUpper(category.Type[0]) + category.Type.Substring(1).ToLower();


    var addedCategory = await _service.AddCategoryAsync(category);
    return Ok(addedCategory);
}

//-------------------Delete Category-----------------------------//
    [HttpDelete("{id}")]
public async Task<IActionResult> DeleteCategory(int id)
{
    var deleted = await _service.DeleteCategoryAsync(id);

    if (!deleted)
        return NotFound(new { message = $"Category with ID {id} not found" });

    return Ok( "Category deleted successfully" );
}
    }
}





   
