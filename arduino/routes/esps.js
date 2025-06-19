// main.js
// 서버 실행. (포트 연결, 서버시작)
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Sensor = require("./sensor.js"); // Sensor 모델을 가져옵니다.
const cors = require("cors");
// const morgan = require("morgan"); // 로깅 미들웨어 
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// 중복작성으로 오류발생!
// mongoose.connect("mongodb://13.125.242.239:27017/sensordb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

// simple api
app.get("/Hello", (req, res) => {
  res.send("Hello World!!!");
});

// post, request body, response O
// app.get("/get-sensor", async (req, res) => {
//   const light = parseInt(req.query.light);
//   if (isNaN(light)) {
//     return res.status(400).send("잘못된 센서 값입니다");
//   }

//   try {
//     const newSensor = new Sensor({ light });
//     await newSensor.save();
//     console.log("저장된 값:", light);
//     res.json({ ok: "get", value: light });
//   } catch (err) {
//     console.error("저장 실패:", err);
//     res.status(500).send("서버 오류");
//   }
// });

app.get('/cds-value', async (req, res) => {
  try {
    const { myvalue, type } = req.query;

    if (!myvalue || isNaN(myvalue)) {
      return res.status(400).send('Invalid or missing lux value');
    }

    if (!type) {
      return res.status(400).send('Missing sensor type');
    }

    const sensorData = new Sensor({
      lux: Number(myvalue),
      sensorType: cds, //cds-value 값을 URL 처리
    });

    await sensorData.save();

    res.status(200).send(`✅ Lux value received: ${myvalue} from sensor: ${type}`);
  } catch (error) {
    console.error('❌ Error saving sensor data:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});

module.exports = app;