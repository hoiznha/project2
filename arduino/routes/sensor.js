const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  lux: {
    type: Number,
    required: true,
  },
  sensorType: {
    type: String,
    required: true,
    enum: ['cds', 'photoresistor', 'lightSensor'], // 필요 시 추가 가능
    default: 'cds',
  },
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
