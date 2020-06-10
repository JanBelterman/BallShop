const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('../domain/Order')

const PaymentSchema = new Schema({
    date:{
        type: Date,
        required: true
    },
    Payed:{
        type: Boolean,
        required:true
    },
    OrderID:{
        type:String,
        required:true
    },
    CustomerID:{
        type:String,
        required:true
    },
    order:Order.OrderSchema
});
const PaymentSchemaMongo = mongoose.model('payment',PaymentSchema)
module.exports ={PaymentSchema:PaymentSchemaMongo} 