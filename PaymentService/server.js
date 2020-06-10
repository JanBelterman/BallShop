const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/Routes')
const rabbitMQConnection = require("./Messaging/MessageSender");
const app = express()
const database = require('./database/connect')

database.connectToDB();
rabbitMQConnection.connect();

app.use(bodyParser.json());

app.all('*', function(req, res, next){
	next()
})

routes(app);

//let port = process.env.PORT || config.port;

app.listen(3060, () => {
	console.log('De server draait op 3060')
})