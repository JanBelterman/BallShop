const BaseEvent = require("./BaseEvent");

module.exports = class ProductsAddedToInventoryEvent extends BaseEvent {
    constructor(timestamp, data) {
        super("ProductsAddedToInventoryEvent", timestamp, data);
    }
};
