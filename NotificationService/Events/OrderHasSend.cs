using Ball.Infrastructure.Messaging;
using System;

namespace Ball.NotificationService.Events
{
    public class OrderHasSend : Event
    {
        public readonly string OrderId;

        public OrderHasSend(Guid messageId, string orderId) : 
            base(messageId)
        {
            OrderId = orderId;
        }
    }
}
