const amqp = require('amqplib');
const Paymentservice = require('../Service/PaymentService')

let conn; // RabbitMQ connection
let ch; // RabbitMQ channel

module.exports.connect = async function connect(){
      try {
          conn = await amqp.connect('amqp://rabbitmquser:testpass12345@rabbitmq:5672');
          console.log("connected to rabbitMQ")
      } catch (e) {
          console.log("Unable to connect to RabbitMQ, retrying in 5 sec..");
          setTimeout(connect, 5000)
          return
      }
      ch = await conn.createChannel();
      await ch.assertExchange("BallShop", "fanout");
      await ch.assertQueue("PaymentService");
      await ch.bindQueue("PaymentService","BallShop",'')
      ListentoQueue("PaymentService");
      }
    async function ListentoQueue(service) {
      const eventHandler = new Paymentservice();
      await ch.consume(service, (msg) => {
          if (msg !== null) {
            console.log(msg)
              if ( msg.properties.headers.MessageType === 'OrderRegisteredEvent') {
                ch.ack(msg)
                eventHandler.PayOrder(msg);
            }
              else{
                console.log('Message not handled')
              }
          }
      });
  }
  module.exports.publishEvent = async function publishEvent(event) {
    console.log(event.json)
    ch.publish("BallShop", "", Buffer.from(JSON.stringify(event.json)), { headers: { MessageType: event.type } });
};
    