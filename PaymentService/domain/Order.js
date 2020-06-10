const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    _Orderid:{
        type:String
    },
    date:{
        type: Date,
        required: true
    },
});

module.exports = {OrderSchema:OrderSchema};