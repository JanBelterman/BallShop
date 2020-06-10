const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Adress{
    constructor(street, housenumber,city,country){
        this.street = street;
        this.housenumber = housenumber;
        this.city = city;
        this.country = country;
    }
}
const AdressSchema = new Schema({
    street:{
        type:String,
        required:true
    },
    housenumber:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
});
AdressSchema.plugin(require('mongoose-autopopulate'));
module.exports = {
    Adress:Adress,
    AdressSchema:AdressSchema
};