const mongoose = require('mongoose')

module.exports.connectToDB = async function connectToDB() {
    try {
        await mongoose.connect('mongodb://mongodbuser:testpass12345@mongodb:27017/Payment-service?connectTimeoutMS=2000&bufferCommands=false&authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to database..')
    } catch (e) {
        console.log(e)
        console.log('Unable to connect to database, retrying in 5 sec..')
        setTimeout(connectToDB, 5000)
    }
}
