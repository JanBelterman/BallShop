using System;

public class QuestionSubmittedEvent{
    
    public int id { get; }
    public int userId { get; set; }
    public string question { get; set; }
    
    public QuestionSubmittedEvent( int id, int userId, string question){
        this.id = id;
        this.userId = userId;
        this.question = question;
    }
}