using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using FinanceTrackerApi.Controllers;
using FinanceTrackerApi.Data;
using FinanceTrackerApi.Models;
using System.Security.Claims;        
using Microsoft.AspNetCore.Http;    
using FinanceTrackerApi.Dtos;


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
        }

       
    //  GET TESTS
    public class TransactionController_GetTests
    {
        [Fact]
        public async Task Get_ReturnsOk_WithPagedResult()
        {
            // Arrange
            var mockService = new Mock<ITransactionService>();

            var pagedResult = new PagedResult<Transaction>
            {
                PageNumber = 1,
                PageSize = 10,
                TotalRecords = 1,
                Data = new List<Transaction>
                {
                    new Transaction
                    {
                        Id = 1,
                        Amount = 500,
                        Type = "income"
                    }
                }
            };

            mockService
                .Setup(s => s.GetPagedAsync(1, 10, "Datetime2", "desc"))
                .ReturnsAsync(pagedResult);

            var controller = new TransactionController(mockService.Object);

            // Act
            var result = await controller.Get(1, 10, "Datetime2", "desc");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedData = Assert.IsType<PagedResult<Transaction>>(okResult.Value);

            Assert.Equal(1, returnedData.TotalRecords);
            Assert.Single(returnedData.Data);
        }
        // DELETE TEST
    public class TransactionControllerTests
{
    private readonly Mock<ITransactionService> _mockService;
    private readonly TransactionController _controller;

    public TransactionControllerTests()
    {
        _mockService = new Mock<ITransactionService>();
        _controller = new TransactionController(_mockService.Object);
    }
    
        [Fact]
        public void Delete_ExistingTransaction_ReturnsOk()
        {
            // Arrange
            int transactionId = 1;

            _mockService
                .Setup(s => s.DeleteTransaction(transactionId))
                .Returns(true);

            // Act
            var result = _controller.Delete(transactionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Deleted successfully", okResult.Value);
        }
    }
    } 
    // UPDATE TEST
     [Fact]
    public void Update_Transaction_ReturnsOk()
    {
        var transaction = new Transaction { Amount = 100, Type = "income" };
        _mockService.Setup(s => s.UpdateTransaction(1, transaction)).Returns(true);
        var result = _controller.Update(1, transaction);
        Assert.IsType<OkObjectResult>(result);
    }
}
}