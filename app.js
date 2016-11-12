// 최초로 실행되는 애플리케이션 = 엔트리

/*****************변수*******************/
// 기본
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
// 중요 정보 저장 파일(비밀번호 등)
var credentials = require('./credentials.js');
// 세션 관련
var cookieParser = require('cookie-parser');
var session = require('express-session');
// DB 관련
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
// var dbOption = {
//   host: 'localhost',
//   user: 'root',
//   port: 3306,
//   password: 'ehehgks!!123',
//   database: 'whitespace',
//   connectionLimit: 10
// }
var dbOption = {
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b039430e5252e3',
  // port: 3306,
  password: '65bbc547',
  database: 'heroku_a9f1b70cbd1f5d3',
  connectionLimit: 10
}
mysql url://b039430e5252e3:65bbc547@us-cdbr-iron-east-04.cleardb.net/heroku_a9f1b70cbd1f5d3?reconnect=true

var pool = mysql.createPool(dbOption);
// 로그인 인증 관련
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var emailService = require('./public/js/verify-email.js')(credentials);

/****************************************/


/*****************설정*******************/

// static 미들웨어, 정적 자원 디렉토리 지정
app.use(express.static(__dirname + '/public'))
   .use(require('body-parser').urlencoded({extended: true}))
   .use(cookieParser(credentials.cookieSecret))
   .use(session({
     secret: credentials.cookieSecret,
     resave: false,
     saveUninitialized: false,
     store: new MySQLStore(dbOption)
   }))
   .use(passport.initialize())
   .use(passport.session());

// 뷰 엔진 핸들바 설정
app.engine('handlebars', handlebars.engine)
   .set('view engine', 'handlebars');

// 애플리케이션 포트 지정
// res.writeHead 대용
// app.set('port', process.env.PORT || 3001);
app.set('port', process.env.PORT || 5000);


/****************************************/


/***************라우팅*******************/
require('./public/js/routes/routes.js')(app, pool, passport, LocalStrategy, emailService);

/***************************************/

/*****************핸들러*******************/

// app.use = 미들웨어 추가 메서드, 라우트와 일치하지 않는 모든 것을 처리
// 매개변수 수를 통해 404와 500 핸들러 구분
// 404와 500은 상태 코드를 명시적으로 지정해야 한다
// 모든 라우트 다음에 쓴다

// 404 폴백 핸들러
app.use(function(req, res){
 //res.writeHead 대용
 res.status(404);
 res.render('404', {layout: 'none'});
});

// 500 에러 페이지
app.use(function(err, req, res, next){
 console.error(err.stack);
 res.status(500);
 res.render('500', {layout: 'none'});
});
/******************************************/

app.listen(app.get ('port'), function(){
 console.log('Server is running 3001 port');
});
