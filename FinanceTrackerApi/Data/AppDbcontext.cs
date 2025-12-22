
using FinanceTrackerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTrackerApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<MonthlySummary> MonthlySummaries{ get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure User Id as auto-incrementing
            modelBuilder.Entity<User>().ToTable("Users")
                .Property(u => u.Id)
                .ValueGeneratedOnAdd();  // EF will auto-generate int IDs
         
                  modelBuilder.Entity<Transaction>().ToTable("Transactions", "dbo")// schema name
                 .Property(t => t.Type)
                 .HasConversion<string>();
         
          base.OnModelCreating(modelBuilder);
            
        }
    }

    public class FiLterAPI
    {
    }
}

          