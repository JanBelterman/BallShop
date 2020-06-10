const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Order",
    new mongoose.Schema({
        customer: {
            type: {
                name: {
                    type: String
                }
            }
        },
        deliveryAddress: {
            type: {
                country: String,
                city: String,
                street: String,
                houseNr: String,
            }
        },
        orderIsPicked: {
            type: Boolean,
            default: false
        },
        isSent: {
            type: Boolean,
            default: false
        },
        deliveryJob: {
            postalCompany: {
                type: String
            },
            price: {
                type: Number
            },
            expectedDeliveryDate: {
                type: Date
            }
        },
        orderLines: [
            {
                product: {
                    id: {
                        type: String
                    },
                    title: {
                        type: String
                    },
                    retailer: {
                        name: {
                            type: String
                        },
                        id: {
                            type: String
                        }
                    }
                },
                quantity: {
                    type: Number
                }
            },
        ],
    })
);
