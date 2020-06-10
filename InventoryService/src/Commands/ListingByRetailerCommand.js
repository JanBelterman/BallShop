const BaseCommand = require('./BaseCommand')

module.exports = class ListingByRetailerCommand extends BaseCommand {

    constructor(timestamp, retailerId, productId, price) {
        super(timestamp)
        this.retailerId = retailerId
        this.productId = productId
        this.price = price
    }

}
