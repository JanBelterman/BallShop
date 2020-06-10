using Ball.Infrastructure.Messaging;
using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ball.NotificationService.Events
{
    public class OrderPaid : Event
    {
        public readonly String OrderId;
        public readonly DateTime OrderDate;


        public readonly String CustomerId;

        public readonly String PaymentType;

        public OrderPaid(Guid messageId, String _id, DateTime date, String status, String paymentType, String customerID, JObject customer) : base(messageId)
        {
            OrderId = _id;
            OrderDate = date;
            CustomerId = customerID;
            PaymentType = paymentType;
        }
    }
}
