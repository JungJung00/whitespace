// 최초로 실행되는 애플리케이션 = 엔트리

var fortunes = [
 "Conquer your fears or they will conquer you",
 "Rivers need springs",
 "Do not fear what you don't know",
 "Whenever possible, keep it simple"
];

const express = require('express');
var app = express();

// static 미들웨어, 정적 자원 디렉토리 지정
app.use(express.static(__dirname + '/public'))
   .use(require('body-parser').urlencoded({extended: true}));

// 뷰 엔진 핸들바 설정
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine)
   .set('view engine', 'handlebars');

// 애플리케이션 포트 지정
// res.writeHead 대용
app.set('port', process.env.PORT || 3001);


/***************라우팅*******************/
app.get('/', function(req, res){
 // 뷰 엔진에서 콘텐츠 타입 text/html과 상태 코드 200을 반환하므로 명시하지 않는다.
 res.render('home');
});

app.get('/returning', function(req, res){
 res.render('returning', {layout: 'none'});
})
app.post('/returning', function(req, res) {
  console.log(req.body)
  res.redirect('/returning');
});
/***************************************/


//////////////핸들러//////////////
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

//////////////////////////////////

app.listen(app.get ('port'), function(){
 console.log('Server is running 3001 port');
});
