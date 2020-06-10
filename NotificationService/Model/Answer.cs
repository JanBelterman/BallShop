using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ball.NotificationService.Model
{
    public class Answer
    {
        public string AnswerId { get; set; }
        public string QuestionId { get; set; }
        public string CustomerId { get; set; }
        public string AnswerString { get; set; }
    }
}
