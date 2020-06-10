using System;

namespace CustomerServiceAPI.Models
{
    public class Answer
    {
        public int id { get; }
        public int questionId { get; set; }
        public int userId { get; set; }
        public string answer { get; set; }
    }
}
