using Ball.Infrastructure.Messaging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ball.NotificationService.Events
{
    public class CustomerRegistered : Event
    {
        public readonly string CustomerId;
        public readonly string Name;
        public readonly string TelephoneNumber;
        public readonly string EmailAddress;

        public CustomerRegistered(Guid messageId, string id, string username, string name, string email, string city, string telephone) : 
            base(messageId)
        {
            CustomerId = id;
            Name = name;
            TelephoneNumber = telephone;
            EmailAddress = email;
        }
    }
}
