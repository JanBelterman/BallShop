const BaseEvent = require("./BaseEvent");

module.exports = class DeliveryIsSentEvent extends BaseEvent {
  constructor(timestamp, data) {
    super("DeliveryIsSentEvent", timestamp, data);
  }
};
