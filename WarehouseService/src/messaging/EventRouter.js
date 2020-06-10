const Order = require('../models/Order')

const EventController = require('../controllers/EventController')
const eventController = new EventController()

module.exports = class EventHandler {

    constructor() {
        this.eventController = new EventController()
    }

    async routeEvent(event) {
        return new Promise(async (resolve, reject) => {
            if (event.properties.headers.MessageType === 'OrderFinalizedEvent') {
                await eventController.orderFinalizedEvent(event)
                resolve()
            } else {
                console.log(`We don't react to event type: ${event.properties.headers.MessageType}`)
                reject({ type: 'DontReact' })
            }
        })
    }

}