const mongoose = require("mongoose");

module.exports = mongoose.model(
  'Retailer',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 2,
    },
  })
);
