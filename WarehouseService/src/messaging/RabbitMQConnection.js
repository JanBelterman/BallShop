const config = require('config')
const amqp = require("amqplib");

const EventRouter = require('./EventRouter')

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
    await ch.assertQueue("WarehouseService", { durable: true });
    await ch.bindQueue('WarehouseService', 'BallShop', '')
    subscribeToQueue();
    console.log("Connected to RabbitMQ");
};

async function subscribeToQueue() {
    const eventRouter = new EventRouter()
    await ch.consume("WarehouseService", async (msg) => {
        if (msg !== null) {
            try {
                await eventRouter.routeEvent(msg);
            } catch (e) {
                if (e.type != 'DontReact') return
            }
            ch.ack(msg)
        }
    });
}

module.exports.publishEvent = async function publishEvent(event) {
    ch.publish("BallShop", "", Buffer.from(JSON.stringify(event.json)), { headers: { MessageType: event.type } });
};
