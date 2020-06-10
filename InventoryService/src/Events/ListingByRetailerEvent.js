const BaseEvent = require("./BaseEvent");

module.exports = class ListingByRetailerEvent extends BaseEvent {
  constructor(timestamp, data) {
    super("ListingByRetailerEvent", timestamp, data);
  }
};
