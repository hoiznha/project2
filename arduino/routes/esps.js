// main.js
// 서버 실행. (포트 연결, 서버시작)
const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// simple api
app.get("/Hello", (req, res) => {
  res.send("Hello World!!");
});

// post, request body, response O
app.get("/get-sensor", (req, res) => {
  const light = req.query.light;
  console.log("value : "+light);
  res.json({ok:"get", value : light});
})

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