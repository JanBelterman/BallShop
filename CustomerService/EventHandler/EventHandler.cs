using System;
using RabbitMQ.Client;
using System.Text;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

public class EventHandler{

    public EventHandler(){}
    
        public void newEvent(Event x, string type){

        var factory = new ConnectionFactory() { 
            HostName = "rabbitmq",
            UserName = "rabbitmquser",
            Password = "testpass12345" 
            };
        
        using(var connection = factory.CreateConnection())
        using(var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queue: "CustomerService",
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            // var message = GetMessage(args);
            var serializerSettings = new JsonSerializerSettings();
            
            var data = JsonConvert.SerializeObject(x, serializerSettings);

            // string data = MessageSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(data);

            var properties = channel.CreateBasicProperties();
            properties.Headers = new Dictionary<string, object> { { "MessageType", type} };
            properties.Persistent = true;

            channel.BasicPublish(exchange: "BallShop",
                                 routingKey: "CustomerService",
                                 basicProperties: properties,
                                 body: body);
        }
    }
}