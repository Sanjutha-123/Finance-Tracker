
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using FinanceTrackerApi.Controllers;
using FinanceTrackerApi.Models;
using FinanceTrackerApi.Service;
using FinanceTrackerApi.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinanceTrackerApi.Tests.Controllers
{
    public class TransactionControllerTests
    {
        private readonly Mock<ITransactionService> _mockService;
        private readonly TransactionController _controller;

        public TransactionControllerTests()
        {
            _mockService = new Mock<ITransactionService>();
            _controller = new TransactionController(_mockService.Object);

            // Mock a logged-in user for token-based methods
            var user = new System.Security.Claims.ClaimsPrincipal(
                new System.Security.Claims.ClaimsIdentity(
                    new[]
                    {
                        new System.Security.Claims.Claim("id", "1") // userId = 1
                    }
                )
            );
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext
                {
                    User = user
                }
            };
        }


        // ---------------- GET BY ID ----------------
        [Fact]
        public async Task GetById_ExistingTransaction_ReturnsOk()
        {
            var transaction = new Transaction { Id = 1, Amount = 100, Type = "income" };

            _mockService
                .Setup(s => s.GetByIdAsync(1, 1))
                .ReturnsAsync(transaction);

            var result = await _controller.GetById(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedTransaction = Assert.IsType<Transaction>(okResult.Value);
            Assert.Equal(1, returnedTransaction.Id);
        }

        // ---------------- CREATE ----------------
        [Fact]
        public async Task Add_ValidTransaction_ReturnsOk()
        {
            var dto = new TransactionDto { Amount = 200, Type = "income" };

            _mockService
                .Setup(s => s.AddTransaction(dto, 1))
                .ReturnsAsync(new Transaction { Id = 1, Amount = 200, Type = "income" });

            var result = await _controller.Add(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var created = Assert.IsType<Transaction>(okResult.Value);
            Assert.Equal(200, created.Amount);
        }

        // ---------------- UPDATE ----------------
        [Fact]
        public async Task Update_ExistingTransaction_ReturnsOk()
        {
            var dto = new TransactionDto { Amount = 150, Type = "expense" };

            _mockService
                .Setup(s => s.UpdateTransaction(1, dto, 1))
                .ReturnsAsync(true);

            var result = await _controller.Update(1, dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Updated successfully", okResult.Value);
        }

        // ---------------- DELETE ----------------
        [Fact]
        public async Task Delete_ExistingTransaction_ReturnsOk()
        {
            _mockService
                .Setup(s => s.DeleteTransaction(1, 1))
                .ReturnsAsync(true);

            var result = await _controller.Delete(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Deleted successfully", okResult.Value);
        }
    }
}
