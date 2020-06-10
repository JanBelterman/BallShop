using Ball.NotificationService.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ball.NotificationService.Repositories
{
    public interface INotificationRepository
    {
        Task RegisterCustomerAsync(Customer customer);
        Task RegisterOrderAsync(Order job);
        Task RegisterQuestionAsync(Question question);
        Task RegisterAnswerAsync(Answer answer);
        Task<IEnumerable<Order>> GetOrdersForTodayAsync(DateTime date);
        Task<Customer> GetCustomerAsync(string customerId);
        Task<Question> GetQuestionAsync(string questionId);
        Task<Order> GetOrderAsync(string orderId);
    }
}
