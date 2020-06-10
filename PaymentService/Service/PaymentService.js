const Payment = require('../domain/Payments')
const MessageSender = require('../Messaging/MessageSender')
const PaymentHandledEvent = require('../events/PaymentHandledEvent')

module.exports = class OrderService{

    async PayOrder(event){
        
        const body = JSON.parse(event.content)
        if(body.body.order.paymentType == "now")
        {
            let payment = new Payment.PaymentSchema({date: new Date().getTime(),Payed:true,OrderID:body.body.order._id,CustomerID:body.body.order.CustomerID,order:{_Orderid:body.body.order._id,date:body.body.order.date}})
            await payment.save();
            MessageSender.publishEvent(
                new PaymentHandledEvent(new Date().getTime(),{payment: payment})
            )
        }
        else if(body.body.order.paymentType == "later")
        {
            let payment = new Payment.PaymentSchema({date: new Date().getTime(),Payed:false,OrderID:body.body.order._id,CustomerID:body.body.order.CustomerID,order:{_Orderid:body.body.order._id,date:body.body.order.date}})
            await payment.save();
            MessageSender.publishEvent(
                new PaymentHandledEvent(new Date().getTime(),{payment: payment})
            )
        }
    }
}