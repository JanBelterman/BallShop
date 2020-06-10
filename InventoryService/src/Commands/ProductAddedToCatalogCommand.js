const BaseCommand = require('./BaseCommand')

module.exports = class ProductAddedToCatalogCommand extends BaseCommand {

    constructor(timestamp, title, description, initialInventory) {
        super(timestamp)
        this.title = title
        this.description = description
        this.initialInventory = initialInventory
    }

}
