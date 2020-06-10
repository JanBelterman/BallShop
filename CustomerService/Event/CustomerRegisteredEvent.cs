using System;

public class CustomerRegisteredEvent{

    public int id;
    public string username;
    public string name;
    public string email;
    public string city;
    public string telephone;

    public CustomerRegisteredEvent( int id, string username, string name, string email, string city, string telephone){
        this.id = id;
        this.username = username;
        this.name = name;
        this.city = city;
        this.email = email;
        this.telephone = telephone;
    }
}