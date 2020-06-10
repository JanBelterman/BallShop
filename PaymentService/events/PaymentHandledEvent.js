const BaseEvent = require("./BaseEvent");

module.exports = class PaymentHandledEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("PaymentHandeldEvent", timestamp, body);
  }
};
