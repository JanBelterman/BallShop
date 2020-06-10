using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Linq;
using Ball.Infrastructure.Messaging;
using Ball.NotificationService.Events;
using Ball.NotificationService.Model;
using Ball.NotificationService.NotificationChannels;
using Ball.NotificationService.Repositories;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Ball.NotificationService
{
    public class NotificationManager : IHostedService, IMessageHandlerCallback
    {
        IMessageHandler _messageHandler;
        INotificationRepository _repo;
        IEmailNotifier _emailNotifier;

        public NotificationManager(IMessageHandler messageHandler, INotificationRepository repo, IEmailNotifier emailNotifier)
        {
            _messageHandler = messageHandler;
            _repo = repo;
            _emailNotifier = emailNotifier;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _messageHandler.Start(this);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _messageHandler.Stop();
            return Task.CompletedTask;
        }

        public async Task<bool> HandleMessageAsync(string messageType, string message)
        {
            try
            {
                JObject messageObject = MessageSerializer.Deserialize(message);
                JObject messageData;
                switch (messageType)
                {
                    case "CustomerRegistered":
                        messageData = MessageSerializer.Deserialize(messageObject["data"].ToString());
                        await HandleAsync(messageData.ToObject<CustomerRegistered>());
                        break;
                    case "QuestionSubmitted":
                        messageData = MessageSerializer.Deserialize(messageObject["data"].ToString());
                        await HandleAsync(messageData.ToObject<QuestionSubmitted>());
                        break;
                    case "AnswerSubmitted":
                        messageData = MessageSerializer.Deserialize(messageObject["data"].ToString());
                        await HandleAsync(messageData.ToObject<AnswerSubmitted>());
                        break;
                    case "OrderRegisteredEvent":
                        messageData = MessageSerializer.Deserialize(messageObject["body"]["order"].ToString());
                        await HandleAsync(messageData.ToObject<OrderPaid>());
                        break;
                    case "DeliveryIsSendEvent":
                        messageData = MessageSerializer.Deserialize(messageObject["data"].ToString());
                        await HandleAsync(messageData.ToObject<OrderHasSend>());
                        break;
                    case "DayHasPassed":
                        await HandleAsync(messageObject.ToObject<DayHasPassed>());
                        break;
                    default:
                        break;
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, $"Error while handling {messageType} event.");
            }

            return true;
        }

        private async Task HandleAsync(CustomerRegistered cr)
        {
            Customer customer = new Customer
            {
                CustomerId = cr.CustomerId,
                Name = cr.Name,
                TelephoneNumber = cr.TelephoneNumber,
                EmailAddress = cr.EmailAddress
            };

            Log.Information("Register customer: {Id}, {Name}, {TelephoneNumber}, {Email}", 
                customer.CustomerId, customer.Name, customer.TelephoneNumber, customer.EmailAddress);

            await _repo.RegisterCustomerAsync(customer);
        }

        private async Task HandleAsync(QuestionSubmitted cr)
        {
            Question question = new Question
            {
                QuestionId = cr.QuestionId,
                CustomerId = cr.CustomerId,
                QuestionString = cr.QuestionString
            };

            Log.Information("Register question: {QuestionId}, {CustomerId}, {QuestionString}", 
                question.QuestionId, question.CustomerId, question.QuestionString);

            await _repo.RegisterQuestionAsync(question);
        }
        private async Task HandleAsync(AnswerSubmitted cr)
        {
            Answer answer = new Answer
            {
                AnswerId = cr.AnswerId,
                QuestionId = cr.QuestionId,
                CustomerId = cr.CustomerId,
                AnswerString = cr.AnswerString
            };

            Question question = await _repo.GetQuestionAsync(answer.QuestionId);
            Customer customer = await _repo.GetCustomerAsync(answer.CustomerId);

            Log.Information("Register answer: {AnswerId}, {QuestionId}, {CustomerId}, {AnswerString}", 
                answer.AnswerId, answer.QuestionId, answer.CustomerId, answer.AnswerString);

             StringBuilder body = new StringBuilder();
            body.AppendLine($"Dear {customer.Name},\n");
            body.AppendLine($"The following question has been answered:\n");
            body.AppendLine($"{question.QuestionString}");
            body.AppendLine($"\nThe answer from our customer service is as followed:\n");
            body.AppendLine($"{answer.AnswerString}");
            body.AppendLine($"\nIf you have futher questions please contact our customer service.\n");
            body.AppendLine($"Greetings,\n");
            body.AppendLine($"The Ball crew");

            Log.Information("Sent notification to: {CustomerName}", customer.Name);

            // send notification
            await _emailNotifier.SendEmailAsync(
                customer.EmailAddress, "noreply@ball.com", "Your Question has been answered", body.ToString());

            await _repo.RegisterAnswerAsync(answer);
        }


        private async Task HandleAsync(OrderPaid mjp)
        {
            Log.Information("Order: " + mjp.OrderId);
            Order order = new Order
            {
                OrderId = mjp.OrderId.ToString(),
                CustomerId = mjp.CustomerId,
                OrderDate = mjp.OrderDate,
                PaymentType = mjp.PaymentType
            };

            Log.Information("Register Order: {Id}, {CustomerId}, {OrderDate}}", 
                order.OrderId, order.CustomerId, order.OrderDate);

            string customerId = order.CustomerId;
            Customer customer = await _repo.GetCustomerAsync(customerId);
            StringBuilder body = new StringBuilder();
            body.AppendLine($"Dear {customer.Name},\n");
            body.AppendLine($"The following order has been placed:\n");
            body.AppendLine($"- {order.OrderDate.ToString("dd-MM-yyyy")} : " +
                $"Order has been placed with order number {order.OrderId}");
            body.AppendLine($"\nWe will notify you when your order has been sent.\n");
            body.AppendLine($"Greetings,\n");
            body.AppendLine($"The Ball crew");

            Log.Information("Sent notification to: {CustomerName}", customer.Name);

            // send notification
            await _emailNotifier.SendEmailAsync(
                customer.EmailAddress, "noreply@ball.com", "Order has been placed", body.ToString());

            

            await _repo.RegisterOrderAsync(order);
        }

        private async Task HandleAsync(OrderHasSend mjf)
        {

            //TODO order send mail and testing functionality
            Order order = await _repo.GetOrderAsync(mjf.OrderId);
            string customerId = order.CustomerId;
            Customer customer = await _repo.GetCustomerAsync(customerId);
            StringBuilder body = new StringBuilder();
            body.AppendLine($"Dear {customer.Name},\n");
            body.AppendLine($"The following order has been sent:\n");
            body.AppendLine($"- {order.OrderDate.ToString("dd-MM-yyyy")} : " +
                $"Order has been sent with order number {order.OrderId}");
            body.AppendLine($"\nFor any questions please contact us on the customer service.\n");
            body.AppendLine($"Greetings,\n");
            body.AppendLine($"The Ball crew");

            Log.Information("Sent notification to: {CustomerName}", customer.Name);

            // send notification
            await _emailNotifier.SendEmailAsync(
                customer.EmailAddress, "noreply@ball.com", "Order has been sent", body.ToString());
            Log.Information("Order has sent: {Id}", mjf.OrderId);
        }

        private async Task HandleAsync(DayHasPassed dhp)
        {
            DateTime today = DateTime.Now;
            // Log.Information("DayHasPassed Event");
            IEnumerable<Order> ordersToNotify = await _repo.GetOrdersForTodayAsync(today);
            foreach (var ordersPerCustomer in ordersToNotify.GroupBy(order => order.CustomerId))
            {
                // build notification body
                string customerId = ordersPerCustomer.Key;
                Customer customer = await _repo.GetCustomerAsync(customerId);
                StringBuilder body = new StringBuilder();
                body.AppendLine($"Dear {customer.Name},\n");
                body.AppendLine($"The following order needs to be paid:\n");
                foreach (Order order in ordersPerCustomer)
                {
                    body.AppendLine($"- {order.OrderDate.ToString("dd-MM-yyyy")} : " +
                        $"Order needs to be paid with order number {order.OrderId}");
                }

                body.AppendLine($"\nPlease pay your order in 4 days.\n");
                body.AppendLine($"Greetings,\n");
                body.AppendLine($"The Ball crew");

                Log.Information("Sent notification to: {CustomerName}", customer.Name);

                // send notification
                await _emailNotifier.SendEmailAsync(
                    customer.EmailAddress, "noreply@ball.com", "Order needs to be paid", body.ToString());
            }
        }
    }
}
