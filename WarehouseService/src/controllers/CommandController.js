const _ = require('lodash')

const Messaging = require('../messaging/RabbitMQConnection')
const DeliverySentEvent = require('../Events/DeliverySentEvent')
const DeliveryJobRegisteredEvent = require('../Events/DeliveryJobRegisteredEvent')


module.exports = class CommandController {

    async orderIsPickedCommand(command) {
        command.order.orderIsPicked = true
        command.order.deliveryJob.postalCompany = 'PostNL'
        command.order.deliveryJob.price = 10
        command.order.deliveryJob.expectedDeliveryDate = Date.now()
        await command.order.save()
        Messaging.publishEvent(new DeliveryJobRegisteredEvent(new Date().getTime(), {
            orderId: command.orderId,
            postalService: command.order.deliveryJob.postalCompany,
            expectedDeliveryDate: command.order.deliveryJob.expectedDeliveryDate
        }))
    }

    async deliverySendCommand(command) {
        command.order.isSent = true
        await command.order.save()
        Messaging.publishEvent(new DeliverySentEvent(new Date().getTime(), {
            orderId: command.orderId,
            postalService: command.order.deliveryJob.postalCompany,
            expectedDeliveryDate: command.order.deliveryJob.expectedDeliveryDate,
            products: _.map(command.order.orderLines, (orderLine) => {
                return {
                    productId: orderLine.product.id,
                    quantity: orderLine.quantity
                }
            })
        }))
    }

}