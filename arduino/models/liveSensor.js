const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  lux: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
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

// 'Sensor'라는 이름으로 모델을 생성
// mongoDB에서 'sensorSchema'라는 컬렉션으로 저장.
// 세번째 인자 : 컬렉션명
module.exports = mongoose.model("liveSensor", sensorSchema,"lightData");
// module.exports = mongoose.model("Sensor", sensorSchema,"luxMeasurements");