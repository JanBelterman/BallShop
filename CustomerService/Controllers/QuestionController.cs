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
    [Route("api/Question")]
    public class QuestionController : ControllerBase
    {
        private readonly ILogger<CustomerServiceController> _logger;
        private readonly QuestionContext _questionContext;

        public EventHandler eventHandler = new EventHandler();
        
        public QuestionController(ILogger<CustomerServiceController> logger, QuestionContext ticketContext)
        {
            _logger = logger;
            _questionContext = ticketContext;
        }

        [HttpPost]
        public async Task<ActionResult<Question>> SubmitTicket(Question question)
        {
            _questionContext.Questions.Add(question);
            await _questionContext.SaveChangesAsync();

            QuestionSubmittedEvent ticket1 = new QuestionSubmittedEvent(question.id, question.userId, question.question);
            eventHandler.newEvent(new Event(DateTime.Now, ticket1), "QuestionSubmitted");

            return CreatedAtAction(nameof(SubmitTicket), new { userId = question.userId }, question);
        }
    }
}
