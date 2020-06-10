const Order = require('../domain/Order')
const MessageSender = require('../Messaging/MessageSender')
const OrderRegisterdEvent = require('../events/OrderRegisterdEvent')

module.exports = (app)=>{
    app.post('/Orders',async (req,res) =>{
        newOrder = new Order.OrderMongo({date: req.body.date,status:req.body.status,paymentType:req.body.paymentType,CustomerID:req.body.CustomerID,customer:{name:req.body.customer.name,adress:{street:req.body.customer.adress.street,housenumber: req.body.customer.adress.housenumber,city:req.body.customer.adress.city,country:req.body.customer.adress.country}},products:req.body.products})
        await  newOrder.save()
        res.send({
            status: "success",
            created: newOrder,
        });
        await newOrder.save()
        MessageSender.publishEvent(
            new OrderRegisterdEvent(new Date().getTime(), { order: newOrder })
        );
    })
}