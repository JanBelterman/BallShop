const BaseEvent = require("./BaseEvent");

module.exports = class DeliveryJobRegisteredEvent extends BaseEvent {
    constructor(timestamp, data) {
        super("DeliveryJobRegisteredEvent", timestamp, data);
    }
};
