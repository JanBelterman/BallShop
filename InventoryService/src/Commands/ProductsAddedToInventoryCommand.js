const BaseCommand = require('./BaseCommand')

module.exports = class ProductsAddedToInventoryCommand extends BaseCommand {

    constructor(timestamp, productId, amount) {
        super(timestamp)
        this.productId = productId
        this.amount = amount
    }

}
