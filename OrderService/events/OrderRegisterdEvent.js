const BaseEvent = require("./BaseEvent");

module.exports = class OrderRegisterdEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("OrderRegisteredEvent", timestamp, body);
  }
};
