// 최초로 실행되는 애플리케이션 = 엔트리

/*****************변수*******************/

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
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
// 게시판 목록 저장
var _boards = '';
// 비동기 순서 체크용
var test = 0;

/****페이징****/

// 한 페이지에 출력될 게시물 수
const countPost = 10;
// 한 페이지에 출력될 페이지 수
const countPage = 10;
// 총 페이지 수
var totalPage = 0;
// 표시 시작 페이지
var startPage = 0;
// 표시 끝 페이지
var endPage = 0;
// 현재 페이지
var page = 5;

/*************/

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

app.get('/home', function(req, res){
 pool.getConnection(function(err, connection){
   if(err) throw err;
   else{
     connection.query('select brd_Title from board', function(err, rows){
       _boards = '';
       for(var i in rows){
         _boards += '<li>' + rows[i].brd_Title + '</li>';
       }console.log('Get boards menu');
      // x  console.log(_boards);
       // getConnection 함수 밖에 렌더 함수를 쓰면 비동기 방식이기 때문에 게시판 항목을 모두 읽어오기 전 렌더링을 해버린다.
       res.render('home', {boards: _boards});
     });
   }
   connection.release();
 });
});
app.post('/homeN', function(req, res){
  // 페이지 정보 구하는 부분 모듈화하기
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      connection.query('SELECT COUNT(*) AS totalCount FROM post', function(err, rows){
        totalPage = parseInt(rows[0].totalCount / countPage);
        // 게시물이 남을 경우 페이지 하나 추가
        if(rows[0].totalCount % countPage) totalPage += 1;

        endPage = parseInt(req.body.cPage) + 3;
        startPage = parseInt(req.body.cPage) - 3;

        if(startPage < 1){
          /* 현재 페이지를 기점으로 앞뒤 5페이지씩 출력. 앞쪽으로
             출력할 페이지가 없으면 그 수만큼 페이지를 뒤쪽으로 더
             출력해준다.*/
          endPage -= startPage;
          startPage = 1;
        }
        if(endPage>totalPage) endPage = totalPage;

        console.log({cPage:parseInt(req.body.cPage), sPage:startPage, ePage:endPage, tPage:totalPage});
        connection.release();
        res.json({cPage:parseInt(req.body.cPage), sPage:startPage, ePage:endPage, tPage:totalPage, test:'text?'});
      });
    }
  });
});
app.post('/homeP', function(req, res){
  pool.getConnection(function(err, connection){
    // var prepost='{';
    if(err) throw err;
    connection.query('SELECT brd_Title, pst_Date, pst_Id, pst_Title, pst_View, pst_Writer FROM post LIMIT ?, 10', (parseInt(req.body.cPage)-1) * 10, function(err, rows){
      // for(var i in rows){
      //   prepost += '{brd_Title: ' + rows[i].brd_Title
      // }
      connection.release();
      res.json(rows);
    });
  });
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
          // 아이디 불일치
          if(rows.length == 0){
            console.log('\n\nThere is no ID that you typed');
            res.redirect('/returning');
          }
          else{
            // 아이디, 비밀번호 일치
            if(req.body.pwd == rows[0].mbr_Pwd){
              console.log('\n\nWelcome ' + rows[0].mbr_Nick + '!');
              res.redirect('/home');
            }
            // 비밀번호 불일치
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
