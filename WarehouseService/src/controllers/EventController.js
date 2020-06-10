const _ = require('lodash')

const Order = require('../models/Order')

module.exports = class EventController {

    async orderFinalizedEvent(event) {
        console.log('Incoming OrderFinalizedEvent')
        const body = JSON.parse(event.content).body.order
        console.log(body)
        const order = new Order({
            customer: {
                name: body.customer.name
            },
            deliveryAddress: {
                country: body.customer.country,
                city: body.customer.city,
                street: body.customer.street,
                houseNr: body.customer.housenumber,
            },
            orderIsPicked: false,
            orderLines: _.map(body.products, (product) => {
                return {
                    product: {
                        id: product._id,
                        title: product.name,
                        retailer: {
                            id: product.retailer._id,
                            name: product.retailer.name
                        }
                    },
                    quantity: 1
                }
            })
        })
        order._id = body._id
        await order.save()
    }

}