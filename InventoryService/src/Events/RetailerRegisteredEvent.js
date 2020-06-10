const BaseEvent = require("./BaseEvent");

module.exports = class RetailerRegisteredEvent extends BaseEvent {
  constructor(timestamp, data) {
    super("RetailerRegisteredEvent", timestamp, data);
  }
};
