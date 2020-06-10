using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ball.NotificationService.Model
{
    public class Order
    {
        public string OrderId { get; set; }
        public string CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public string PaymentType { get; set; }
    }
}
