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
  res.send("Hello World!!");
});

// post, request body, response O
app.get("/get-sensor", async (req, res) => {
  const light = parseInt(req.query.light);
  if (isNaN(light)) {
    return res.status(400).send("잘못된 센서 값입니다");
  }

  try {
    const newSensor = new Sensor({ light });
    await newSensor.save();
    console.log("저장된 값:", light);
    res.json({ ok: "get", value: light });
  } catch (err) {
    console.error("저장 실패:", err);
    res.status(500).send("서버 오류");
  }
});

app.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});


// // NodeMCU에서 센서값 전달 (GET 방식)
// app.get('/get-sensor', (req, res) => {
//   const light = req.query.light;
//   if (light) {
//     latestLight = {
//       value: light,
//     };
//     console.log('value :', latestLight);
//   } else {
//     res.status(400).send('Missing light parameter');
//   }
// });

// // 외부에서 최근 센서값 조회
// app.get('/latest-light', (req, res) => {
//   if (latestLight) {
//     res.json({ok:"get", value : latestLight});
//   } else {
//     res.status(404).json({ message: 'No data yet' });
//   }
// });


// post, request body, response O
// app.post("/post-sensor", (req, res) => {
//   const { sensor_number, value } = req.body;
//   console.log("sensor_number : "+sensor_number+" / value : "+value);
//   res.json({ok:"post", sensor_number:sensor_number, value : value});
// })

module.exports = app;