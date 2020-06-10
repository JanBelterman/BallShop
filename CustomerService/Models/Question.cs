using System;

namespace CustomerServiceAPI.Models
{
    public class Question
    {
        public int id { get; }
        public int userId { get; set; }
        public string question { get; set; }
    }
}
