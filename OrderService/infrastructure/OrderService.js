const Order = require('../domain/Order')
const CatalogProduct = require('../domain/CatalogProduct')
const MessageSender = require('../Messaging/MessageSender')
const OrderRegisterdEvent = require('../events/OrderRegisterdEvent')
const OrderFinilizedEvent = require('../events/OrderFinalized')

module.exports = class OrderService {

    async updateOrderDeliveryStatus(event) {
        console.log(JSON.parse(event.content))
        const body = JSON.parse(event.content)
        console.log(body)
        const order = await Order.OrderMongo.findOne({ _id: body.data.orderId })
        order.status = "Ready for order delivery" //deliverystatus veranderen
        await order.save()
    }
    async updateOrderPaymentType(event) {
        console.log(JSON.parse(event.content))
        const body = JSON.parse(event.content)
        const order = await Order.OrderMongo.findOne({ _id: body.body.payment.OrderID })
        order.paymentStatus = "Payment Handeld"
        order.status = "Ready for order picking"
        await order.save()
        MessageSender.publishEvent(
            new OrderFinilizedEvent(new Date().getTime(), { order: order })
        );
    }

    async addProductToCache(event) {
        console.log(JSON.parse(event.content))
        const body = JSON.parse(event.content)
        const catalogProduct = new CatalogProduct({
            originalId: body.data.id,
            title: body.data.title,
            description: body.data.description,
            inventory: body.data.inventory
        })
        await catalogProduct.save()
    }

    async productAddedToInventory(event) {
        console.log(JSON.parse(event.content))
        const body = JSON.parse(event.content)
        const catalogProduct = await CatalogProduct.findOne({ originalId: body.data.productId })
        catalogProduct.inventory = body.data.newInventoryTotal
        await catalogProduct.save()
    }
}