const mongoose = require('mongoose')

const catalogProductSchema = new mongoose.Schema({
    originalId: String,
    title: String,
    description: String,
    inventory: Number
})

module.exports = mongoose.model('CatalogProduct', catalogProductSchema)