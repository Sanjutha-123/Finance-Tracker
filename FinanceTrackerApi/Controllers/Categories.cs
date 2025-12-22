using FinanceTrackerApi.Dtos;
using Microsoft.AspNetCore.Mvc;
using FinanceTrackerApi.Services;

namespace FinanceTrackerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

    // CREATE CATEGORY
    [HttpPost]
    public async Task<IActionResult> Create(CategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);
        return Ok(category);
    }

    // UPDATE CATEGORY
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CategoryDto dto)
    {
        var updatedCategory = await _categoryService.UpdateAsync(id, dto);
        if (updatedCategory == null)
            return NotFound("Category not found");

        return Ok(updatedCategory);
    }

    // DELETE CATEGORY
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoryService.DeleteAsync(id);
        if (!deleted)
            return NotFound("Category not found");

        return Ok("Category deleted successfully");
    }
}
    }