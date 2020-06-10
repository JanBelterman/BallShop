const ProductStore = require('../models/ProductStore')
const ProductReadModel = require('../models/ProductReadModel')

module.exports = class EventHandler {

    async deliveryIsSendEvent(event) {
        return new Promise(async (resolve, reject) => {
            console.log('Incoming DeliveryIsSendEvent')
            const products = event.data.products
            for (const p of products) {
                let productStore
                try {
                    productStore = await ProductStore.findOne({ _id: p.productId })
                } catch (e) {
                    productStore = null
                }

                if (!productStore) {
                    console.log(`[WARNING] Can't find product with id: ${p.productId} SKIPPING`)
                    continue;
                }

                productStore.events.push({
                    eventType: 'ProductsTakenFromInventoryEvent',
                    inventoryDecreasedAmount: p.quantity
                })
                await productStore.save()

                ProductReadModel.findOne({ _id: p.productId }).then(product => {
                    product.inventory -= p.quantity
                    product.save()
                })
            }
            resolve()
        })
    }

}