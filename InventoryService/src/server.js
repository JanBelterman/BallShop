const config = require("config");
const express = require("express");

// Database
// require('./database/connect')()

// Messaging
// const rabbitMQConnection = require("./messaging/RabbitMQConnection");
// rabbitMQConnection.connect();

// API
const app = express();
app.use(express.json())
app.use('/', (req, res) => {
    console.log('Request incoming')
    res.send('Hello world')
})
app.use('/products', require('./routes/productRoutes'))
app.use('/retailers', require('./routes/retailerRoutes'))

app.listen(config.get('PORT'), () => {
    console.log("Inventory service running..");
});