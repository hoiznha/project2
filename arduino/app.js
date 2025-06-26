require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express(); // 메인 Express 애플리케이션 인스턴스
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose"); // Mongoose 임포트
const cors = require('cors'); // CORS 미들웨어 임포트

// --- 앱 설정 ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // 뷰 엔진 설정 (Jade 사용)
app.set('port', process.env.PORT || 3000); // 환경 변수 PORT 사용 또는 기본값 3000

// --- 전역 미들웨어 설정 (모든 라우트보다 먼저 적용) ---
app.use(morgan('dev')); // HTTP 요청 로깅 (개발용)
app.use(bodyParser.json()); // JSON 본문 파싱
app.use(bodyParser.urlencoded({ extended: false })); // URL-encoded 본문 파싱
app.use(cookieParser()); // 쿠키 파싱
app.use(express.static(path.join(__dirname, 'public'))); // 'public' 폴더의 정적 파일 서비스
app.use(cors()); // CORS 활성화 (모든 출처 허용. 필요시 특정 출처로 제한 가능)

// --- 라우트 설정 ---
// './routes/esps.js'에 정의된 라우터 모듈을 임포트합니다.
const esps = require('./routes/esps.js');
// esps 라우터를 애플리케이션의 루트 경로('/')에 마운트합니다.
// 이렇게 하면 esps.js의 모든 라우트가 '/' 경로 아래에서 작동합니다.
app.use('/', esps);

// ★★★ 임시 테스트 라우트 추가 시작 ★★★
// 이 테스트 라우트는 esps 라우터 뒤에 있어도 동작합니다.
app.get('/test-route', (req, res) => {
  res.send('Hello from test-route!');
  console.log('✅ /test-route API가 호출되었습니다.');
});
// ★★★ 임시 테스트 라우트 추가 끝 ★★★


// --- MongoDB 연결 및 서버 시작 ---
// .env 파일의 MONGO_URL 환경 변수를 사용합니다.
// 만약 .env 파일이 없거나 환경 변수가 설정되지 않았다면, 하드코딩된 로컬 MongoDB 주소를 사용합니다.
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/sensordb";

// MongoDB에 연결 시도
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true, // 새로운 URL 파서 사용
  useUnifiedTopology: true, // 새로운 통합 토폴로지 엔진 사용
})
.then(() => {
  console.log('✅ MongoDB 연결 성공!');
  // MongoDB 연결 성공 시에만 Express 서버를 시작합니다.
  app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`🚀 서버가 포트 ${app.get('port')}번(0.0.0.0)에서 실행 중입니다.`);
  });
})
.catch(err => {
  console.error('❌ MongoDB 연결 오류:', err);
  // MongoDB 연결 실패 시, 서버 시작을 중단하고 프로세스를 종료합니다.
  process.exit(1);
});

// MongoDB 연결 오류 이벤트 핸들러 (연결이 끊기거나 문제 발생 시)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB 연결 오류:"));
// 'open' 이벤트는 mongoose.connect().then()에서 이미 처리하고 있으므로 별도로 추가하지 않습니다.
// db.once("open", () => {
//   console.log("✅ MongoDB 연결 성공");
// });