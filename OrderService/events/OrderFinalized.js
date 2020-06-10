const BaseEvent = require("./BaseEvent");

module.exports = class OrderFinalizedEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("OrderFinalizedEvent", timestamp, body);
  }
};
