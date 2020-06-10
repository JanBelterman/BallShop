const mongoose = require("mongoose");

const PRODUCT_ADDED_TO_CATALOG_EVENT = 'ProductAddedToCatalogEvent'
const PRODUCT_TAKEN_FROM_INVENTORY_EVENT = 'ProductsTakenFromInventoryEvent'
const PRODUCTS_ADDED_TO_INVENTORY_EVENT = 'ProductsAddedToInventoryEvent'
const LISTING_BY_RETAILER_EVENT = 'ListingByRetailerEvent'
const LISTING_REMOVED_EVENT = 'ListingRemovedEvent'

const listingSchema = mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    retailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Retailer",
        required: true,
    }
})

const productSchema = new mongoose.Schema({
    events: [{
        eventType: {
            type: String,
            enum: [
                PRODUCT_ADDED_TO_CATALOG_EVENT,
                PRODUCT_TAKEN_FROM_INVENTORY_EVENT,
                PRODUCTS_ADDED_TO_INVENTORY_EVENT,
                LISTING_BY_RETAILER_EVENT
            ],
            required: true
        },
        productTitle: String,
        productDescription: String,
        inventoryIncreasedAmount: Number,
        inventoryDecreasedAmount: Number,
        listingAdded: listingSchema,
        listingRemovedId: String
    }]
})

productSchema.virtual('inventory').get(function () {
    let inventory = 0
    for (const event of this.events) {
        inventory += event.inventoryIncreasedAmount || 0
        inventory -= event.inventoryDecreasedAmount || 0
    }
    return inventory
})

productSchema.virtual('listings').get(function () {
    const removedListings = []
    for (const event of this.events) {
        if (event.eventType == LISTING_REMOVED_EVENT) {
            removedListings.push(event.listingRemovedId)
        }
    }
    const listings = []
    for (const event of this.events) {
        if (event.eventType == LISTING_BY_RETAILER_EVENT && removedListings.indexOf(event.listingAdded._id.toString) == -1) {
            listings.push(event.listingAdded)
        }
    }
    return listings
})

productSchema.virtual('title').get(function () {
    return this.events[0].productTitle
})

productSchema.virtual('description').get(function () {
    return this.events[0].productDescription
})

module.exports = mongoose.model("ProductStore", productSchema);
