const BaseEvent = require("./BaseEvent");

module.exports = class ProductAddedToCatalogEvent extends BaseEvent {
  constructor(timestamp, data) {
    super("ProductAddedToCatalogEvent", timestamp, data);
  }
};
