// 필요한 모듈들을 임포트합니다.
const express = require('express');
const router = express.Router(); // Express 라우터 인스턴스를 생성합니다.
const preSensor = require("../models/predictSensor");
const liveSensor = require("../models/liveSensor");
// ★ 중요: CORS 및 Body-Parser 미들웨어는 app.js에서 전역적으로 설정했으므로
// 이곳에서는 별도로 임포트하거나 router.use() 할 필요가 없습니다.

// --- API 엔드포인트 정의 ---

// 1. 센서 데이터를 수신하고 MongoDB에 저장하는 GET API
// NodeMCU에서 HTTP GET 요청으로 이 경로를 사용합니다.
// 예시: http://13.125.242.239:3000/get-sensor?light=500
// router.get("/get-sensor", async (req, res) => {
//   try {
//     const lightValue = parseInt(req.query.myvalue);

//     console.log(req.query);
    
//     if (!lightValue || isNaN(lightValue)) {
//       console.log("❌ 잘못된 센서값:", lightValue);
//       return res.status(400).send("Invalid light value");
//     }
    
//     const now = new Date();
//     const isOnTheHour = now.getMinutes() === 0 && now.getSeconds() === 0;

//     if (!isOnTheHour) {
//       console.log("🕒 정각이 아님 - 저장 생략:", now.toISOString());
//       return res.status(200).send("Not on the hour - data not saved");
//     }

//     // 정각이면 저장
//     const newSensor = new Sensor({
//       lux: lightValue,
//       timestamp: now,
//     });

//     await newSensor.save();
//     console.log("✅ 정각에 저장 성공:", newSensor);
//     res.status(200).send(`Saved lux value ${lightValue} at the hour`);

//   } catch (error) {
//     console.error("❌ 저장 중 오류:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// 30분~1시간 정각에 측정되는값을 저장.
// router.get("/get-sensor", async (req, res) => {
//   try {
//     const lightValue = parseInt(req.query.myvalue);

//     if (!lightValue || isNaN(lightValue)) {
//       console.log("❌ 잘못된 센서값:", lightValue);
//       return res.status(400).send("Invalid light value");
//     }

//     const now = new Date();
//     const minutes = now.getMinutes();
//     const seconds = now.getSeconds();

//     // 매 시각 00분 또는 30분, 초는 0~2초 사이일 때만 저장
//     const isOnThe30MinMark = (minutes === 0 || minutes === 30) && seconds <= 2;

//     if (!isOnThe30MinMark) {
//       console.log("⏳ 00분 또는 30분이 아님 - 저장 생략:", now.toISOString());
//       return res.status(200).send("Not 00 or 30 minute mark - data not saved");
//     }

//     // 저장
//     const newSensor = new liveSensor({
//       lux: lightValue,
//       timestamp: now,
//     });

//     await newSensor.save();
//     console.log("✅ 30분 간격 저장 성공:", newSensor);
//     res.status(200).send(`Saved lux value ${lightValue} at ${now.toISOString()}`);

//   } catch (error) {
//     console.error("❌ 저장 중 오류:", error);
//     res.status(500).send("Internal server error");
//   }
// });

router.get("/lux-history", async (req, res) => {
  try {
    // liveSensor 모델에서 데이터 전체 조회, 최신순 정렬
    const converted = await liveSensor.find().sort({ timestamp: -1 });

    console.log("✅ 조도 이력 조회 성공");
    res.status(200).json(converted);
  } catch (error) {
    console.error("❌ 조도 이력 조회 실패:", error);
    res.status(500).send("조도 데이터를 불러오는 데 실패했습니다.");
  }
});

// NodeMCU에서 서버로 값을 전송받고, mongoDB에 값을 저장.
router.get("/get-sensor", async (req, res) => {
  try {
    const lightValue = parseInt(req.query.myvalue);

    if (!lightValue || isNaN(lightValue)) {
      console.log("❌ 잘못된 센서값:", lightValue);
      return res.status(400).send("Invalid light value");
    }

    const nowUTC = new Date();
    const nowKST = new Date(nowUTC.getTime() + 9 * 60 * 60 * 1000); // UTC+9

    // 저장
    const newSensor = new liveSensor({
      lux: lightValue,
      timestamp: nowKST,
    });

    await newSensor.save();
    console.log("✅ 저장 성공:", newSensor);
    res.status(200).send(`Saved lux value ${lightValue} at ${nowKST.toISOString()}`);

  } catch (error) {
    console.error("❌ 저장 중 오류:", error);
    res.status(500).send("Internal server error");
  }
});


// 2. MongoDB에 저장된 모든 센서 데이터를 조회하여 API로 제공하는 GET 엔드포인트
// 이 API를 호출하면 'luxMeasurements' 컬렉션의 모든 데이터가 JSON 형태로 반환됩니다.
// 예시: http://<당신서버IP>:3000/all-sensor-data
router.get("/all-sensor-data", async (req, res) => {
  try {
    // Sensor 모델(luxMeasurements 컬렉션)에서 모든 문서를 조회하고 'timestamp' 필드를 기준으로 최신순으로 정렬합니다.
    const allSensorData = await preSensor.find().sort({ timestamp: -1 });
    
    console.log("✅ MongoDB에서 모든 센서 데이터 조회 성공.");
    // 조회된 데이터를 JSON 형식으로 클라이언트에게 응답합니다.
    res.status(200).json(allSensorData);
  } catch (error) {
    // 데이터 조회 중 오류 발생 시 콘솔에 에러 로그를 출력하고 500 Internal Server Error 응답을 보냅니다.
    console.error("❌ MongoDB에서 센서 데이터 조회 실패:", error);
    res.status(500).send("센서 데이터를 조회하는 데 실패했습니다.");
  }
});

// 3. (옵션) 특정 ID의 센서 데이터를 조회하는 GET API
// 예시: http://<당신서버IP>:3000/sensor-data/65f21d3f6a6b7c8d9e0f1234
router.get("/sensor-data/:id", async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 ID를 추출합니다.
    const sensorData = await Sensor.findById(id); // 해당 ID의 문서를 조회합니다.

    // 문서가 없는 경우 404 Not Found 응답을 보냅니다.
    if (!sensorData) {
      return res.status(404).send('센서 데이터를 찾을 수 없습니다.');
    }
    // 조회된 데이터를 JSON 형식으로 클라이언트에게 응답합니다.
    res.status(200).json(sensorData);
  } catch (error) {
    // 조회 중 오류 발생 시 콘솔에 에러 로그를 출력하고 500 Internal Server Error 응답을 보냅니다.
    console.error(`❌ ID ${req.params.id} 센서 데이터 조회 중 오류 발생:`, error);
    res.status(500).send('ID로 센서 데이터를 조회하는 데 실패했습니다.');
  }
});

// --- 기타 API (기존 코드에서 필요하다면 유지) ---
// 루트 경로에 대한 간단한 응답 API
router.get("/", (req, res) => {
  res.send("MongMong");
});

// POST 방식으로 센서 데이터를 수신하는 API (req.body 사용)
// body-parser 미들웨어가 app.js에서 적용되어 있으므로 req.body 사용 가능합니다.
router.post("/post-sensor", (req, res) => {
  const { sensor_number, value } = req.body; // 요청 본문(body)에서 데이터 추출
  console.log("sensor_number : "+sensor_number+" / value : "+value);
  res.json({ok:"post", sensor_number:sensor_number, value : value});
});


// 이 라우터 인스턴스를 모듈의 외부로 내보냅니다.
// app.js에서 const esps = require('./routes/esps.js'); 처럼 임포트될 것입니다.
module.exports = router;
