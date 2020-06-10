using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Ball.NotificationService.NotificationChannels
{
    public interface IEmailNotifier
    {
        Task SendEmailAsync(string to, string from, string subject, string body);
    }
}
