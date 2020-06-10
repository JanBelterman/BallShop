using Ball.Infrastructure.Messaging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ball.NotificationService.Events
{
    public class AnswerSubmitted : Event
    {
        public readonly string AnswerId;
        public readonly string QuestionId;
        public readonly string CustomerId;
        public readonly string AnswerString;

        public AnswerSubmitted(Guid messageId, string id, string questionId, string userId, string answer) : 
            base(messageId)
        {
            AnswerId = id;
            QuestionId = questionId;
            CustomerId = userId;
            AnswerString = answer;
        }
    }
}
