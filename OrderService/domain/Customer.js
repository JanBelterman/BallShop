let Adress = require('../domain/Adress')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Customer{
    constructor(name,adress){
        this.name = name;
        this.adress = new Adress(adress);
    }
}
const CustomerSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    adress: Adress.AdressSchema
});
CustomerSchema.plugin(require('mongoose-autopopulate'));

module.exports = {
    Customer:Customer,
    CustomerSchema:CustomerSchema
};