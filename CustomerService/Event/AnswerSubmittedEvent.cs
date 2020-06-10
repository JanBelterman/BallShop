using System;

public class AnswerSubmittedEvent{
    
    public int id { get; }
    public int userId { get; set; }
    public int questionId { get; set; }
    public string answer { get; set; }
    
    public AnswerSubmittedEvent(int id, int userId, int questionId, string answer){
        this.id = id;
        this.userId = userId;
        this.questionId = questionId;
        this.answer = answer;
    }
}