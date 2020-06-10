using Ball.Infrastructure.Messaging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ball.NotificationService.Events
{
    public class DayHasPassed : Event
    {
        public DayHasPassed(Guid messageId) : base(messageId)
        {
        }
    }
}
