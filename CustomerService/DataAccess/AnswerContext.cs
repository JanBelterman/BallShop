using Microsoft.EntityFrameworkCore;
using CustomerServiceAPI.Models;

namespace CustomerServiceAPI.DataAccess
{
    public class AnswerContext : DbContext
    {
        public AnswerContext(DbContextOptions<AnswerContext> options)
            : base(options)
        {
        }

        public DbSet<Answer> Answers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Answer>().HasKey(x => x.id);
            builder.Entity<Answer>().ToTable("Answer");
            base.OnModelCreating(builder);
        }
    }
}