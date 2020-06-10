using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CustomerServiceAPI.Models;
using CustomerServiceAPI.DataAccess;

namespace CustomerServiceAPI.Controllers
{
    [ApiController]
    [Route("api/CustomerService")]
    public class CustomerServiceController : ControllerBase
    {
        private readonly ILogger<CustomerServiceController> _logger;
        private readonly CustomerContext _customerContext;

        public EventHandler eventHandler = new EventHandler();
        
        public CustomerServiceController(ILogger<CustomerServiceController> logger, CustomerContext customerContext)
        {
            _logger = logger;
            _customerContext = customerContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            var customer = await _customerContext.Customers.FindAsync(id);

            if (customer == null)
            {
               return NotFound();
         }
            return customer;
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> Register(Customer customer)
        {
            _customerContext.Customers.Add(customer);
            await _customerContext.SaveChangesAsync();
            
            CustomerRegisteredEvent customer1 = new CustomerRegisteredEvent(customer.id, customer.username, customer.name, customer.email, customer.city, customer.telephone);
            eventHandler.newEvent(new Event(DateTime.Now, customer1), "CustomerRegistered");

            return CreatedAtAction(nameof(Register), new { username = customer.username }, customer);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _customerContext.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            _customerContext.Customers.Remove(customer);
            await _customerContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
