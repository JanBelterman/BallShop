using Ball.Infrastructure.Messaging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ball.NotificationService.Events
{
    public class QuestionSubmitted : Event
    {
        public readonly string QuestionId;
        public readonly string CustomerId;
        public readonly string QuestionString;

        public QuestionSubmitted(Guid messageId, string id, string userId, string question) : 
            base(messageId)
        {
            QuestionId = id;
            CustomerId = userId;
            QuestionString = question;
        }
    }
}
