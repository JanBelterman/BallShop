let Product = require('../domain/Product')
let Customer = require('../domain/Customer')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Order{
    constructor(date, products,customer){
        this.date = date;
        this.products = products;
        this.customer = new Customer(customer.name,customer.adress)
    }

    addProduct(Product){
        //check of het wel een product is
        this.products.push(Product)
    }
}
const OrderSchema = new Schema({
    date:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    paymentType:{
        type: String,
        required: true
    },
    CustomerID:{
        type:String
    },
    customer: Customer.CustomerSchema,
    products:[Product.ProductSchema]
});

OrderSchema.plugin(require('mongoose-autopopulate'));
const OrderMongo = mongoose.model('order',OrderSchema);

module.exports = {Order:Order,OrderMongo,OrderMongo};
