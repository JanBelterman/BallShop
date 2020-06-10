const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Retailer{
    constructor(name){
        this.name = name;
    }
}

const RetailerSchema = new Schema({
    name:{
        type:String,
        required:true
    }
})

RetailerSchema.plugin(require('mongoose-autopopulate'));
module.exports = {
    Retailer : Retailer,
    RetailerSchema : RetailerSchema
};