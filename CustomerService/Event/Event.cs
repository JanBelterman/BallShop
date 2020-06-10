using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System.Text;
using System.Collections.Generic;

public class Event{
    public DateTime timestamp;
    public string data;

    public Event(DateTime timestamp, CustomerRegisteredEvent customerRegisteredEvent){
        this.timestamp = timestamp;
        var serializerSettings = new JsonSerializerSettings();
        this.data = JsonConvert.SerializeObject(customerRegisteredEvent, serializerSettings);
    }

    //I know..
    public Event(DateTime timestamp, QuestionSubmittedEvent questionSubmittedEvent){
    this.timestamp = timestamp;
    var serializerSettings = new JsonSerializerSettings();
    this.data = JsonConvert.SerializeObject(questionSubmittedEvent, serializerSettings);
    }

    public Event(DateTime timestamp, AnswerSubmittedEvent answerSubmittedEvent){
    this.timestamp = timestamp;
    var serializerSettings = new JsonSerializerSettings();
    this.data = JsonConvert.SerializeObject(answerSubmittedEvent, serializerSettings);
    }
}
