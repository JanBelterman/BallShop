const rabbitMQConnection = require('../messaging/RabbitMQConnection')
const ProductAddedToCatalogEvent = require("../Events/ProductAddedToCatalogEvent")
const ListingByRetailerEvent = require('../Events/ListingByRetailerEvent')
const ProductsAddedToInventoryEvent = require('../Events/ProductsAddedToInventoryEvent')
const RetailerRegisteredEvent = require('../Events/RetailerRegisteredEvent')
const ProductStore = require('../models/ProductStore')
const ProductReadModel = require('../models/ProductReadModel')
const Retailer = require('../models/Retailer')

module.exports = class CommandController {

    async ProductAddedToCatalogCommand(command) {
        const productStore = new ProductStore();
        productStore.events.push({
            eventType: 'ProductAddedToCatalogEvent',
            productTitle: command.title,
            productDescription: command.description,
            inventoryIncreasedAmount: command.initialInventory
        })
        await productStore.save();

        const productReadModel = new ProductReadModel({
            title: command.title,
            productDescription: command.description,
            inventory: command.initialInventory,
            listings: []
        })
        productReadModel._id = productStore._id
        productReadModel.save()

        rabbitMQConnection.publishEvent(
            new ProductAddedToCatalogEvent(new Date().getTime(), {
                id: productStore._id,
                title: productStore.title,
                description: productStore.description,
                listings: productStore.listings,
                inventory: productStore.inventory
            })
        );

        return {
            id: productStore._id,
            title: productStore.title,
            description: productStore.description,
            listings: productStore.listings,
            inventory: productStore.inventory
        }
    }

    async RetailerRegisteredCommand(command) {
        const retailer = new Retailer({ name: command.name })
        await retailer.save()
        rabbitMQConnection.publishEvent(new RetailerRegisteredEvent(new Date().getTime(), {
            id: retailer._id,
            name: retailer.name
        }))
        return retailer
    }

    async ListingByRetailerCommand(command) {
        let productStore
        let retailer
        try { productStore = await ProductStore.findOne({ _id: command.productId }) }
        catch (e) { productStore = null }
        try { retailer = await Retailer.findOne({ _id: command.retailerId }) }
        catch (e) { retailer = null }

        // Validate data
        if (!productStore) {
            throw { type: 'ProductNotFound' }
        } else if (!retailer) {
            throw ({ type: 'RetailerNotFound' })
        }

        // Update event store
        productStore.events.push({
            eventType: 'ListingByRetailerEvent',
            listingAdded: {
                price: command.price,
                retailer: command.retailerId
            }
        })
        await productStore.save()

        // Publish event
        const createdListing = productStore.events[productStore.events.length - 1]
        rabbitMQConnection.publishEvent(
            new ListingByRetailerEvent(new Date().getTime(), {
                id: createdListing._id,
                retailerId: createdListing.listingAdded.retailer,
                product: productStore._id,
                price: createdListing.listingAdded.price
            })
        )

        // Update read model
        ProductReadModel.findOne({ _id: command.productId }).then(product => {
            product.listings.push({
                id: createdListing.listingAdded._id.toString(),
                retailerName: retailer.name,
                price: createdListing.listingAdded.price
            })
            product.save()
        })

        // API return
        return {
            id: createdListing._id,
            retailerId: createdListing.listingAdded.retailer,
            product: productStore._id,
            price: createdListing.listingAdded.price
        }
    }

    async ProductsAddedToInventoryCommand(command) {
        const productStore = await ProductStore.findOne({ _id: command.productId })
        if (!productStore) {
            throw { type: 'ProductNotFound' }
        }

        productStore.events.push({
            eventType: 'ProductsAddedToInventoryEvent',
            inventoryIncreasedAmount: command.amount
        })
        await productStore.save()

        rabbitMQConnection.publishEvent(
            new ProductsAddedToInventoryEvent(new Date().getTime(), {
                productId: productStore._id,
                addedToInventory: command.amount,
                newTotalInventory: productStore.inventory
            })
        )

        ProductReadModel.findOne({ _id: command.productId }).then(product => {
            product.inventory += command.amount
            product.save()
        })

        return {
            id: productStore._id,
            title: productStore.title,
            description: productStore.description,
            listings: productStore.listings,
            inventory: productStore.inventory
        }
    }

}