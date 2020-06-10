const config = require('config')
const mongoose = require('mongoose')

module.exports = async function connectToDB() {
    try {
        await mongoose.connect(config.get('DB_URL'), {
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
