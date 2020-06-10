using System;
using System.Threading.Tasks;
using Dapper;
using Ball.NotificationService.Model;
using Polly;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using Serilog;

namespace Ball.NotificationService.Repositories
{
    public class SqlServerNotificationRepository : INotificationRepository
    {
        private string _connectionString;

        public SqlServerNotificationRepository(string connectionString)
        {
            _connectionString = connectionString;

            // init db
            Log.Information("Initialize Database");

            Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(10, r => TimeSpan.FromSeconds(10), (ex, ts) => { Log.Error("Error connecting to DB. Retrying in 10 sec."); })
            .ExecuteAsync(InitializeDB)
            .Wait();
        }

        private async Task InitializeDB()
        {
            using (SqlConnection conn = new SqlConnection(_connectionString.Replace("Notification", "master")))
            {
                await conn.OpenAsync();

                // create database
                string sql =
                    "IF DB_ID('Notification') IS NULL CREATE DATABASE Notification;";

                await conn.ExecuteAsync(sql);

                // create tables
                conn.ChangeDatabase("Notification");

                sql = "IF OBJECT_ID('Customer') IS NULL " +
                      "CREATE TABLE Customer (" +
                      "  CustomerId varchar(50) NOT NULL," +
                      "  Name varchar(50) NOT NULL," +
                      "  TelephoneNumber varchar(50)," +
                      "  EmailAddress varchar(50)," +
                      "  PRIMARY KEY(CustomerId));" +

                      "IF OBJECT_ID('Orders') IS NULL " +
                      "CREATE TABLE Orders (" +
                      "  OrderId varchar(50) NOT NULL," +
                      "  CustomerId varchar(50) NOT NULL," +
                      "  PaymentType varchar(50) NOT NULL," +
                      "  OrderDate datetime2 NOT NULL," +
                      "  PRIMARY KEY(OrderId));"+

                      "IF OBJECT_ID('Questions') IS NULL " +
                      "CREATE TABLE Questions (" +
                      "  QuestionId varchar(50) NOT NULL," +
                      "  CustomerId varchar(50) NOT NULL," +
                      "  QuestionString varchar(50) NOT NULL," +
                      "  PRIMARY KEY(QuestionId));" +
                      
                      "IF OBJECT_ID('Answers') IS NULL " +
                      "CREATE TABLE Answers (" +
                      "  AnswerId varchar(50) NOT NULL," +
                      "  QuestionId varchar(50) NOT NULL," +
                      "  CustomerId varchar(50) NOT NULL," +
                      "  AnswerString varchar(50) NOT NULL," +
                      "  PRIMARY KEY(AnswerId));";

                await conn.ExecuteAsync(sql);
            }
        }

        public async Task<Customer> GetCustomerAsync(string customerId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                return await conn.QueryFirstOrDefaultAsync<Customer>("select * from Customer where CustomerId = @CustomerId",
                    new { CustomerId = customerId });
            }
        }
        public async Task<Question> GetQuestionAsync(string questionId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                return await conn.QueryFirstOrDefaultAsync<Question>("select * from Questions where QuestionId = @QuestionId",
                    new { QuestionId = questionId });
            }
        }

        public async Task<Order> GetOrderAsync(string orderId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                return await conn.QueryFirstOrDefaultAsync<Order>("select * from Orders where OrderId = @OrderId",
                    new { OrderId = orderId });
            }
        }

        public async Task RegisterOrderAsync(Order job)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string sql =
                    "insert into Orders(OrderId, CustomerId, OrderDate, PaymentType) " +
                    "values(@OrderId, @CustomerId, @OrderDate, @PaymentType);";
                await conn.ExecuteAsync(sql, job);
            }
        }

        public async Task RegisterQuestionAsync(Question question)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string sql =
                    "insert into Questions(QuestionId, CustomerId, QuestionString) " +
                    "values(@QuestionId, @CustomerId, @QuestionString);";
                await conn.ExecuteAsync(sql, question);
            }
        }

        public async Task RegisterAnswerAsync(Answer answer)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string sql =
                    "insert into Answers(AnswerId, QuestionId, CustomerId, AnswerString) " +
                    "values(@AnswerId, @QuestionId, @CustomerId, @AnswerString);";
                await conn.ExecuteAsync(sql, answer);
            }
        }

        public async Task RegisterCustomerAsync(Customer customer)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string sql =
                    "insert into Customer(CustomerId, Name, TelephoneNumber, EmailAddress) " +
                    "values(@CustomerId, @Name, @TelephoneNumber, @EmailAddress);";
                await conn.ExecuteAsync(sql, customer);
            }
        }

        public async Task<IEnumerable<Order>> GetOrdersForTodayAsync(DateTime date)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                return await conn.QueryAsync<Order>(
                    "select * from Orders where OrderDate <= DateAdd(day,-10,@Today) AND OrderDate > DateAdd(day,-11,@Today) AND PaymentType = 'later'",
                    new { Today = date.Date});
            }
        }
    }
}
