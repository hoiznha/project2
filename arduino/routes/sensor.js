const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  light: Number,
  timestamp: { type: Date, default: Date.now }
});

// const sensorSchema = new mongoose.Schema({
//   timestamp: { type: Date, default: Date.now },
//   device_id: String,
//   sensors: {
//     light: Number,
//     // temperature: Number,
//     // humidity: Number,
//     // pm2_5: Number
//   }
// })

module.exports = mongoose.model("Sensor", sensorSchema);
