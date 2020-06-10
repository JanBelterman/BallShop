const amqp = require('amqplib');
const OrderService = require('../infrastructure/OrderService')

let conn; // RabbitMQ connection
let ch; // RabbitMQ channel

module.exports.connect = async function connect() {
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
  await ch.assertQueue("OrderService");
  await ch.bindQueue("OrderService", "BallShop", '')
  ListentoQueue("OrderService");
}
async function ListentoQueue(service) {
  const eventHandler = new OrderService();
  await ch.consume(service, (msg) => { //moet nog veranderd in andere servers
    if (msg !== null) {
      console.log(msg)
      if (msg.properties.headers.MessageType === 'DeliveryIsSendEvent' || msg.properties.headers.MessageType === 'DeliveryJobRegisteredEvent') {
        ch.ack(msg)
        eventHandler.updateOrderDeliveryStatus(msg);

      } else if (msg.properties.headers.MessageType === 'PaymentHandeldEvent') {
        ch.ack(msg)
        eventHandler.updateOrderPaymentType(msg);

      } else if (msg.properties.headers.MessageType === 'ProductAddedToCatalogEvent') {
        ch.ack(msg)
        eventHandler.addProductToCache(msg)
      } else if (msg.properties.headers.MessageType === 'ProductsAddedToInventoryEvent') {
        ch.ack(msg)
        eventHandler.productAddedToInventory(msg)
      }
      else {
        console.log('Message not handled')
      }
    }
  });
}
module.exports.publishEvent = async function publishEvent(event) {
  console.log(event.json)
  ch.publish("BallShop", "", Buffer.from(JSON.stringify(event.json)), { headers: { MessageType: event.type } });
};

