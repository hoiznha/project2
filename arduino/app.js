//app.js
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const mongoose = require("mongoose");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000)

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes setup
const esps = require('./routes/esps.js');
app.use('/', esps);

app.listen(app.get('port'),'0.0.0.0', () =>{
	console.log('3000 Port : 서버 실행 중')
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB Connected!');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
  });
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});


// // MongoDB connection
// mongoose.connect("mongodb://13.125.242.239:27017/sensordb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
