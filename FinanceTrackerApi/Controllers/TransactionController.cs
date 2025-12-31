using FinanceTrackerApi.Models;
using FinanceTrackerApi.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace FinanceTrackerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _service;

        public TransactionController(ITransactionService service)
        {
            _service = service;
        }

        // Helper: Get logged-in user id from token
    
private int GetUserIdFromToken()
{
    var claim = User.FindFirst("id"); // ⚡ match JWT claim type
    return claim == null ? 0 : int.Parse(claim.Value);
}
        

        // ---------------------- CREATE ----------------------
        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] TransactionDto dto)
        {
            int userId = GetUserIdFromToken();
            if (userId == 0)
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Type) || 
                !(dto.Type.ToLower() == "income" || dto.Type.ToLower() == "expense"))
            {
                return BadRequest("Type must be either 'income' or 'expense'.");
            }

            var result = await _service.AddTransaction(dto, userId); // pass userId
            return Ok(result);
        }

        // ---------------------- GET ALL USER TRANSACTIONS ----------------------
        [HttpGet]
        public async Task<IActionResult> Get(
            int pageNumber = 1, 
            int pageSize = 10, 
            string? sortBy = "Datetime",
            string? sortDirection = "desc")
        {
            int userId = GetUserIdFromToken();
            if (userId == 0) return Unauthorized();

            var result = await _service.GetPagedByUserAsync(userId, pageNumber, pageSize, sortBy, sortDirection);
            return Ok(result);
        }

        // ---------------------- GET BY ID ----------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            int userId = GetUserIdFromToken();
            if (userId == 0) return Unauthorized();

            var transaction = await _service.GetByIdAsync(id, userId);
            if (transaction == null) return NotFound();
            return Ok(transaction);
        }

        // ---------------------- UPDATE ----------------------
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TransactionDto dto)
        {
            int userId = GetUserIdFromToken();
            if (userId == 0) return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Type) || 
                !(dto.Type.ToLower() == "income" || dto.Type.ToLower() == "expense"))
            {
                return BadRequest("Type must be either 'income' or 'expense'.");
            }

            bool ok = await _service.UpdateTransaction(id, dto, userId);
            if (!ok) return NotFound("Transaction not found");

            return Ok("Updated successfully");
        }

        // ---------------------- DELETE ----------------------
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            int userId = GetUserIdFromToken();
            if (userId == 0) return Unauthorized();

            bool ok = await _service.DeleteTransaction(id, userId);
            if (!ok) return NotFound("Transaction not found");

            return Ok("Deleted successfully");
        }

        // ---------------------- FILTER ----------------------
        [HttpGet("filter")]
        public async Task<IActionResult> FilterTransactions(
            [FromQuery] int? categoryId,
            [FromQuery] string? start,
            [FromQuery] string? end,
            [FromQuery] string? type)
        {
            int userId =GetUserIdFromToken();
            if (userId == 0) return Unauthorized();

            DateTime? startDate = null;
            DateTime? endDate = null;

            if (!string.IsNullOrEmpty(start))
                startDate = DateTime.ParseExact(start, "dd-MM-yyyy", null);

            if (!string.IsNullOrEmpty(end))
                endDate = DateTime.ParseExact(end, "dd-MM-yyyy", null)
                                .AddHours(23).AddMinutes(59).AddSeconds(59);

            var data = await _service.Filter(userId, startDate, endDate, categoryId, type);
            return Ok(data);
        }
    }
}
