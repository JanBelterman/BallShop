const express = require('express')
const router = express.Router()

const CommandController = require('../controllers/CommandController')
const ProductAddedToCatalogCommand = require('../Commands/ProductAddedToCatalogCommand')
const listingByRetailerCommand = require('../Commands/ListingByRetailerCommand')
const ProductsAddedToInventoryCommand = require('../Commands/ProductsAddedToInventoryCommand')
const commandController = new CommandController()

router.post("/addProductToCatalogCommand", async (req, res) => {
    const command = new ProductAddedToCatalogCommand(
        new Date().getTime(),
        req.body.title || '',
        req.body.description || '',
        req.body.initialInventory || 0
    )

    let created;
    try {
        created = await commandController.ProductAddedToCatalogCommand(command)
    } catch (e) {
        console.log(e)
        res.status(500).send({ status: 'error', error: 'Something went wrong' })
        return
    }

    res.send({ status: 'success', created })
});

router.post('/listingByRetailerCommand', async (req, res) => {
    const command = new listingByRetailerCommand(
        new Date().getTime(),
        req.body.retailerId,
        req.body.productId,
        req.body.price
    )

    let createdListing
    try {
        createdListing = await commandController.ListingByRetailerCommand(command)
    } catch (e) {
        if (e.type == 'ProductNotFound') {
            res.status(400).send({ status: 'error', message: 'Product is not found' })
        } else if (e.type == 'RetailerNotFound') {
            res.status(400).send({ status: 'error', error: 'Retailer is not found' })
        } else {
            res.status(500).send({ status: 'error', error: 'Something went wrong' })
        }
        return
    }

    res.send({ status: 'success', created: createdListing })
})

router.patch('/addProductsToInventoryCommand', async (req, res) => {
    const command = new ProductsAddedToInventoryCommand(
        new Date().getTime(),
        req.body.productId,
        req.body.amount
    )

    let updatedProduct
    try {
        updatedProduct = await commandController.ProductsAddedToInventoryCommand(command)
    } catch (e) {
        console.log(e)
        if (e.type == 'ProductNotFound') {
            res.status(400).send({ status: 'error', message: 'Product is not found' })
        } else {
            res.status(500).send('Something went wrong')
        }
        return
    }

    res.send({ status: 'success', updated: updatedProduct })
})

const ProductReadModel = require('../models/ProductReadModel')
router.get('/getAllProductsCommand', async (req, res) => res.send(await ProductReadModel.find()));

module.exports = router
