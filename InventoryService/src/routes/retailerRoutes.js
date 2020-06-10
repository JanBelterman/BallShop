const express = require('express')
const router = express.Router()

const CommandController = require('../controllers/CommandController')
const commandController = new CommandController()
const RetailerRegisteredCommand = require('../Commands/RetailerRegisteredCommand')

router.post('/registerRetailerCommand', async (req, res) => {
    const command = new RetailerRegisteredCommand(
        new Date().getTime(),
        req.body.name
    )

    let createdRetailer
    try {
        createdRetailer = await commandController.RetailerRegisteredCommand(command)
    } catch (e) {
        console.log(e)
        res.status(500).send('Something went wrong')
        return
    }

    res.send({
        status: 'success',
        created: createdRetailer
    })
})

const Retailer = require('../models/Retailer')
router.get('/getAllRetailersCommand', async (req, res) => res.send(await Retailer.find()));

module.exports = router;