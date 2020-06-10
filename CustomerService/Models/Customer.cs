using System;

namespace CustomerServiceAPI.Models
{
    public class Customer
    {
        public int id { get; }
        public string username { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public string email { get; set ; }
        public string city { get; set; }
        public string telephone { get; set; }
    }
}
