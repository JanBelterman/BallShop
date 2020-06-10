const express = require('express')

const Order = require('../models/Order')
const CommandController = require('../controllers/CommandController')

const router = express.Router()
const commandController = new CommandController()


router.post('/orderPickedCommand', async (req, res) => {
    const order = await Order.findOne({ _id: req.body.orderId })
    if (!order) {
        res.status(400).send({
            status: 'error',
            message: 'Order is not found'
        })
    } else {
        const command = {
            timestamp: Date.now(),
            orderId: order._id,
            order: order
        }
        commandController.orderIsPickedCommand(command)
        res.send({ status: 'success' })
    }
})

router.post('/orderSentCommand', async (req, res) => {
    const order = await Order.findOne({ _id: req.body.orderId })
    if (!order) {
        res.status(400).send({
            status: 'error',
            message: 'Order is not found'
        })
    } else {
        const command = {
            timestamp: Date.now(),
            orderId: order._id,
            order: order
        }
        commandController.deliverySendCommand(command)
        res.send({ status: "success" })
    }
})

module.exports = router;