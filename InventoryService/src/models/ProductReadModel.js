const mongoose = require('mongoose')

const productReadSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    inventory: {
        type: Number,
        default: 0
    },
    listings: [
        {
            id: String,
            retailerName: String,
            price: Number
        }
    ]
})

module.exports = mongoose.model('ProductRead', productReadSchema)
