using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.OpenApi.Models;
using CustomerServiceAPI.DataAccess;
using CustomerServiceAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using Dapper;
using Polly;
using Serilog;

namespace CustomerServiceAPI
{
    public class Startup
    {
        private string _connectionString;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // add DBContext classes
            _connectionString = "Data Source=sqlserver; Initial Catalog=Customer; User ID=SA; Password=8jkGh47hnDw89Haq8LN2";
            // var sqlConnectionString = "Data Source=localhost,1434;Initial Catalog=Customer;User ID=SA;Password=8jkGh47hnDw89Haq8LN2";
            // var sqlConnectionString = "server=sqlserverTest; user id=sa; password=8jkGh47hnDw89Haq8LN2; database=Customer; MultipleActiveResultSets=True";
            //_configuration.GetConnectionString("VehicleManagementCN");

            Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(10, r => TimeSpan.FromSeconds(10), (ex, ts) => { Log.Error("Error connecting to DB. Retrying in 10 sec."); })
            .ExecuteAsync(InitializeDB)
            .Wait();

            services.AddDbContext<CustomerContext>(options => options.UseSqlServer(_connectionString));
            services.AddDbContext<QuestionContext>(options => options.UseSqlServer(_connectionString));
            services.AddDbContext<AnswerContext>(options => options.UseSqlServer(_connectionString));

            Console.WriteLine("================================================================================================================");
            Console.WriteLine(_connectionString);

            services.AddControllers();

            services.AddMvc();
            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CustomerService API", Version = "v1" });
            });
            services.AddHttpsRedirection(options =>
            {
            // options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
            options.HttpsPort = 5001;
            });
        }

        private async Task InitializeDB(){
            using (SqlConnection conn = new SqlConnection(_connectionString.Replace("Customer", "master")))
            {
                await conn.OpenAsync();

                // create database
                string sql =
                    "IF DB_ID('Customer') IS NULL CREATE DATABASE Customer;";

                await conn.ExecuteAsync(sql);

                // create tables
                conn.ChangeDatabase("Customer");

                sql = "IF OBJECT_ID('Customer') IS NULL " +
                        "CREATE TABLE Customer ( " +
                        "id int NOT NULL IDENTITY(1,1) PRIMARY KEY, " +
                        "username varchar(50) NOT NULL, " +
                        "password varchar(50) NOT NULL, "+
                        "name varchar(50),"+
                        "email varchar(50),"+
                        "city varchar(50),"+
                        "telephone varchar(50));" +

                        "IF OBJECT_ID('Question') IS NULL " +
                        "CREATE TABLE Question ( " +
                        "id int NOT NULL IDENTITY(1,1) PRIMARY KEY, " +
                        "userId int NOT NULL, " +
                        "question varchar(500) NOT NULL) ;" +

                        "IF OBJECT_ID('Answer') IS NULL " +
                        "CREATE TABLE Answer ( " +
                        "id int NOT NULL IDENTITY(1,1) PRIMARY KEY, " +
                        "questionId int NOT NULL," +
                        "userId int NOT NULL, "+
                        "answer varchar(500) NOT NULL);";

                await conn.ExecuteAsync(sql);
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseRouting();
            //app.UseUrls("http://*:5000");
            app.UseAuthorization();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "CustomerService API - v1");
            });

            //
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
