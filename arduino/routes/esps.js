// 필요한 모듈들을 임포트합니다.
const express = require('express');
const router = express.Router(); // Express 라우터 인스턴스를 생성합니다.
const Sensor = require("./sensor"); // 같은 디렉토리에 있는 sensor.js의 Sensor 모델을 가져옵니다.

// ★ 중요: CORS 및 Body-Parser 미들웨어는 app.js에서 전역적으로 설정했으므로
// 이곳에서는 별도로 임포트하거나 router.use() 할 필요가 없습니다.

// --- API 엔드포인트 정의 ---

// 1. 센서 데이터를 수신하고 MongoDB에 저장하는 GET API
// NodeMCU에서 HTTP GET 요청으로 이 경로를 사용합니다.
// 예시: http://13.125.242.239:3000/get-sensor?light=500
router.get("/get-sensor", async (req, res) => {
  try {
    // URL 쿼리 파라미터에서 'light' 값을 추출합니다. (NodeMCU에서 보내는 값)
    const lightValue = parseInt(req.query.myvalue);
    // NodeMCU에서 'type' 파라미터를 보내지 않으므로 'cds'로 고정합니다.
    // const sensorType = 'cds';

    // 'lightValue'가 없거나 숫자가 아니면 400 Bad Request 응답을 보냅니다.
    if (!lightValue || isNaN(lightValue)) {
      console.log("❌ 유효하지 않거나 누락된 'light' 센서 값 수신:", lightValue);
      return res.status(400).send("Invalid or missing light value");
    }

    // Sensor 모델을 사용하여 새로운 문서(Document) 객체를 생성합니다.
    // 이 문서는 sensor.js에 정의된 'luxMeasurements' 컬렉션에 저장됩니다.
    try{
      const newSensor = new Sensor({
        lux: Number(lightValue), // 문자열을 숫자로 변환하여 'lux' 필드에 저장합니다.
        timestamp: new Date(),   // 현재 시각을 'timestamp' 필드에 저장합니다.
      });
      await newSensor.save();
      console.log("저장된 값:", lightValue);
      res.json({ ok: "get", value: lightValue });
    }catch (err) {
      console.error("저장 실패:", err);
      res.status(500).send("서버 오류");
    }
    // 생성된 문서를 MongoDB에 저장합니다.

    // 저장 성공 시 콘솔에 로그를 출력하고 NodeMCU에 성공 응답을 보냅니다.
    console.log("✅  컬렉션에 센서 값 저장 성공:", newSensor);
    res.status(200).send(`Lux value ${lightValue} saved successfully!`);

  } catch (error) {
    // 데이터베이스 저장 중 오류 발생 시 콘솔에 에러 로그를 출력하고 500 Internal Server Error 응답을 보냅니다.
    console.error("❌ MongoDB에 lux 값 저장 중 오류 발생:", error);
    res.status(500).send("서버 오류가 발생하여 데이터를 저장할 수 없습니다.");
  }
});

// 2. MongoDB에 저장된 모든 센서 데이터를 조회하여 API로 제공하는 GET 엔드포인트
// 이 API를 호출하면 'luxMeasurements' 컬렉션의 모든 데이터가 JSON 형태로 반환됩니다.
// 예시: http://<당신서버IP>:3000/all-sensor-data
router.get("/all-sensor-data", async (req, res) => {
  try {
    // Sensor 모델(luxMeasurements 컬렉션)에서 모든 문서를 조회하고 'timestamp' 필드를 기준으로 최신순으로 정렬합니다.
    const allSensorData = await Sensor.find().sort({ timestamp: -1 });
    
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
