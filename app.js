// 최초로 실행되는 애플리케이션 = 엔트리

var fortunes = [
 "Conquer your fears or they will conquer you",
 "Rivers need springs",
 "Do not fear what you don't know",
 "Whenever possible, keep it simple"
];

const express = require('express');
var app = express();

// static 미들웨어, 정적 자원을 담고 있는 디렉터리를 지목해서
// 특별한 처리 없이 클라이언트에 전송. 이미지, css, js-client 등
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({extended: true}));

// 뷰 엔진 핸들바 설정
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// 애플리케이션 포트 지정
// res.writeHead 대용
app.set('port', process.env.PORT || 3001);


///////////라우팅///////////////

app.get('/', function(req, res){
 // 뷰 엔진에서 콘텐츠 타입 text/html과 상태 코드 200을 반환하므로 명시하지 않는다.
 // var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
 // res.render('login', {fortune: randomFortune});
 res.render('home');
});

app.get('/login', function(req, res){
 res.render('login', {layout: 'none'});
});
//////////////////////////////////

app.post('/login', function(req, res) {
 console.log(req.body)
 res.redirect('/login');
});


//////////////핸들러//////////////
// app.use = 미들웨어 추가 메서드, 라우트와 일치하지 않는 모든 것을 처리
// 매개변수 수를 통해 404와 500 핸들러 구분
// 404와 500은 상태 코드를 명시적으로 지정해야 한다
// 모든 라우트 다음에 쓴다

// 404 폴백 핸들러
app.use(function(req, res){
 //res.writeHead 대용
 res.status(404);
 res.render('404');
});

// 500 에러 페이지
app.use(function(err, req, res, next){
 console.error(err.stack);
 res.status(500);
 res.render('500');
});

//////////////////////////////////

app.listen(app.get ('port'), function(){
 console.log('Server is running 3001 port');
});
