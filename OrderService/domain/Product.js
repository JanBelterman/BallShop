let Retailer = require('../domain/Retailer')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Product{
    constructor(name, retailer){
        this.name = name;
        this.retailer = new Retailer(retailer.name)
    }
}

const ProductSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    retailer: Retailer.RetailerSchema
});
ProductSchema.plugin(require('mongoose-autopopulate'));
module.exports = {
    Product:Product,
    ProductSchema:ProductSchema
};