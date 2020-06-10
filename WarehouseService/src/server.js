const config = require("config");
const express = require("express");

// Database
require('./database/connect')()

// Messaging
const rabbitMQConnection = require("./messaging/RabbitMQConnection");
rabbitMQConnection.connect();

// API
const app = express();
app.use(express.json())
app.use('/orders', require('./routes/orders'))

app.listen(config.get('PORT'), () => {
    console.log("Warehouse service running..");
});