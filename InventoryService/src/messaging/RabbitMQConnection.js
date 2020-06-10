const config = require('config')
const amqp = require("amqplib");

const EventHandler = require('./EventHandler')
const DeliveryIsSendEvent = require('../Events/DeliveryIsSentEvent')

let conn; // RabbitMQ connection
let ch; // RabbitMQ channel

module.exports.connect = async function connect() {
    try {
        conn = await amqp.connect(config.get('RABBIT_MQ_URL'));
    } catch (e) {
        console.log("Unable to connect to RabbitMQ, retrying in 5 sec..");
        setTimeout(connect, 5000)
        return
    }
    ch = await conn.createChannel();
    await ch.assertExchange("BallShop", "fanout");
    await ch.assertQueue("InventoryService", { durable: true });
    await ch.bindQueue('InventoryService', 'BallShop', '')
    subscribeToQueue();
    console.log("Connected to RabbitMQ");
};

async function subscribeToQueue() {
    const eventHandler = new EventHandler()
    await ch.consume("InventoryService", async (msg) => {
        if (msg !== null) {
            const body = JSON.parse(msg.content)
            if (msg.properties.headers.MessageType == 'DeliveryIsSendEvent') {
                console.log(msg.properties.headers.MessageType)
                try {
                    await eventHandler.deliveryIsSendEvent(new DeliveryIsSendEvent(body.timestamp, body.data))
                } catch (e) {
                    return
                }
                ch.ack(msg)
            } else {
                console.log(`We don't react to messageType ${msg.properties.headers.MessageType}`)
                ch.ack(msg)
            }
        }
    });
}

module.exports.publishEvent = async function publishEvent(event) {
    console.log(`Sending event: ${event.type}`)
    ch.publish("BallShop", "", Buffer.from(JSON.stringify(event.json)), { headers: { MessageType: event.type } });
};
