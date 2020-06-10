using Microsoft.EntityFrameworkCore;
using CustomerServiceAPI.Models;

namespace CustomerServiceAPI.DataAccess
{
    public class QuestionContext : DbContext
    {
        public QuestionContext(DbContextOptions<QuestionContext> options)
            : base(options)
        {
        }

        public DbSet<Question> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Question>().HasKey(x => x.id);
            builder.Entity<Question>().ToTable("Question");
            base.OnModelCreating(builder);
        }
    }
}