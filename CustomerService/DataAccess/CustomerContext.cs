using Microsoft.EntityFrameworkCore;
using CustomerServiceAPI.Models;

namespace CustomerServiceAPI.DataAccess
{
    public class CustomerContext : DbContext
    {
        public CustomerContext(DbContextOptions<CustomerContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Customer>().HasKey(x => x.id);
            builder.Entity<Customer>().ToTable("Customer");
            base.OnModelCreating(builder);
        }
    }
}