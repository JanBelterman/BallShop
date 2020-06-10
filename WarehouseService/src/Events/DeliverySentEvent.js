const BaseEvent = require("./BaseEvent");

module.exports = class DeliverySentEvent extends BaseEvent {
    constructor(timestamp, data) {
        super("DeliveryIsSendEvent", timestamp, data);
    }
};
