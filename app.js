// 최초로 실행되는 애플리케이션 = 엔트리

/*****************변수*******************/

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
// const $ = require('jquery')(window);
var mysql = require('mysql');
// 커넥션 풀 생성 : 필요할 때마다 연결
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'ehehgks!!123',
  database: 'whitespace',
  connectionLimit: 10
});
// 데이터베이스 연결 설정

var fortunes = [
 "Conquer your fears or they will conquer you",
 "Rivers need springs",
 "Do not fear what you don't know",
 "Whenever possible, keep it simple"
];

/****************************************/


/*****************설정*******************/

// static 미들웨어, 정적 자원 디렉토리 지정
app.use(express.static(__dirname + '/public'))
   .use(require('body-parser').urlencoded({extended: true}));

// 뷰 엔진 핸들바 설정
app.engine('handlebars', handlebars.engine)
   .set('view engine', 'handlebars');

// 애플리케이션 포트 지정
// res.writeHead 대용
app.set('port', process.env.PORT || 3001);

// 데이터베이스 연결 방법
  // pool.getConnection(function(err, cnct){
  //   내용
  // })
/****************************************/


/***************라우팅*******************/

app.get('/', function(req, res){
 // 뷰 엔진에서 콘텐츠 타입 text/html과 상태 코드 200을 반환하므로 명시하지 않는다.
 res.render('home');
});

app.get('/test', function(req, res){
  res.render('test');
});
app.post('/test', function(req, res){
  console.log(req.body.test);
  res.redirect('/test');
});

app.get('/returning', function(req, res){
 res.render('returning', {layout: 'none'});
})
app.post('/returning', function(req, res) {
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      // 로그인 처리
      connection.query('select * from member where mbr_Id = ?', req.body.id, function(err, rows){
        if(err){
          console.log('Query Error: ' + err);
          redirect('/returning');
        }
        else{
          if(rows.length == 0){
            console.log('\n\nThere is no ID that you typed');
            res.redirect('/returning');
          }
          else{
            if(req.body.pwd == rows[0].mbr_Pwd){
              console.log('\n\nWelcome ' + rows[0].mbr_Nick + '!');
              res.redirect('/home');
            }
            else{
              console.log('\n\nWrong password!');
              res.redirect('/returning');
            }
          }
        }
        connection.release();
      });
    }
  });
});

app.get('/moving', function(req, res){
  res.render('moving', {layout: 'none'});
});
app.post('/moving', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      bd = req.body;
      dbSet = {mbr_Id: req.body.id, mbr_Pwd: req.body.pwd, mbr_Nick: req.body.nick, mbr_EMail: req.body.email};
      connection.query("INSERT INTO member SET ?", dbSet,
      function(err, rows){if(err) console.log('Query Error: ' + err); else console.log('Query Success');});
  }
    connection.release();
  });
  console.log(req.body);
  res.redirect('/returning');
});

app.get('/home', function(req, res){
  res.render('home');
});
/***************************************/


/***************핸들링*******************/

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

/***************************************/


app.listen(app.get ('port'), function(){
 console.log('Server is running 3001 port');
});
