const BaseCommand = require('./BaseCommand')

module.exports = class RetailerRegisteredCommand extends BaseCommand {

    constructor(timestamp, name) {
        super(timestamp)
        this.name = name
    }

}
