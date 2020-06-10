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
    [Route("api/Answer")]
    public class AnswerController : ControllerBase
    {
        private readonly ILogger<CustomerServiceController> _logger;
        private readonly AnswerContext _answerContext;

        public EventHandler eventHandler = new EventHandler();
        
        public AnswerController(ILogger<CustomerServiceController> logger, AnswerContext answerContext)
        {
            _logger = logger;
            _answerContext = answerContext;
        }

        [HttpPost]
        public async Task<ActionResult<Answer>> SubmitTicket(Answer answer)
        {
            _answerContext.Answers.Add(answer);
            await _answerContext.SaveChangesAsync();

            AnswerSubmittedEvent ticket1 = new AnswerSubmittedEvent(answer.id, answer.userId, answer.questionId, answer.answer);
            eventHandler.newEvent(new Event(DateTime.Now, ticket1), "AnswerSubmitted");

            return CreatedAtAction(nameof(SubmitTicket), new { answerId = answer.id }, answer);
        }
    }
}
