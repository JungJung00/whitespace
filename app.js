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
var dbOption = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'ehehgks!!123',
  database: 'whitespace',
  connectionLimit: 10
}
var pool = mysql.createPool(dbOption);
// 로그인 인증 관련
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// 암호화 관련
var hasher = require('pbkdf2-password')();
var sha512 = require('sha512')
// 메일 전송 관련
var emailService = require('./public/js/verify-email.js')(credentials);

// 게시판 목록 저장
var _boards = '';

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
   .use(require('body-parser').urlencoded({extended: true}))
   .use(cookieParser(credentials.cookieSecret))
   .use(session({
     secret: credentials.cookieSecret,
     resave: false,
     saveUninitialized: false,
     store: new MySQLStore(dbOption)
   }))
   .use(passport.initialize())
   .use(passport.session())

// 뷰 엔진 핸들바 설정
app.engine('handlebars', handlebars.engine)
   .set('view engine', 'handlebars');

// 애플리케이션 포트 지정
// res.writeHead 대용
app.set('port', process.env.PORT || 3001);

/****************************************/


/***************라우팅*******************/

// TODO delete this snippet
app.get('/test', function(req, res){
  res.render('test');
});
app.post('/test', function(req, res){
  console.log(req.body.test);
});

// 자체 회원 인증
passport.use(new LocalStrategy(
  function(username, password, done){
    pool.getConnection(function(err, connection){
        if(err) throw err;
        else{
          // TODO 입력 틀렸을 경우 페이지 만들기
          // 로그인 처리
          connection.query('SELECT CAST(mbr_Id AS CHAR) AS mbr_Id, mbr_Pwd, mbr_Salt, CAST(mbr_Nick AS CHAR) AS mbr_Nick, mbr_Email,'
                            + 'mbr_Verified + mbr_Chance, mbr_Profile, mbr_Date FROM member WHERE mbr_Id = ?', username, function(err, rows){
            if(err){
              console.log('Query Error: ' + err);
              return done(null, false);
            }
            else{
              if(rows[0].mbr_Verified = 0){
                console.log('Not verified. Please check your mail');
                return done(null, false);
              }
              // 아이디 불일치
              else if(!rows.length){
                console.log('\n\nThere is no ID that you typed');
                return done(null, false);
              }
              else{
                return hasher({password: password, salt: rows[0].mbr_Salt}, function(err, pass, salt, hash){
                  // 아이디, 비밀번호 일치
                  if(hash == rows[0].mbr_Pwd){
                    // 회원 정보를 serializeUser(callback)에 보낸다.
                    console.log(rows[0]);
                    done(null, rows[0]);
                  }
                  // 비밀번호 불일치
                  else{
                    console.log('\n\nWrong password');
                    done(null, false);
                  }
                });
              }
            }
          });
        }
        connection.release();
      });
  }
));
// done이 false가 아닐 경우 실행
// 사용자의 세션(닉네임)을 저장한다.
passport.serializeUser(function(user, done){
  console.log('serial user : ' + user.mbr_Nick);
  done(null, user);
});
// 세션이 이미 저장되어 있을 경우 req에 user 객체를 추가한다.
passport.deserializeUser(function(user, done){
  // req의 객체 user에 저장. user객체는 passport가 새로 추가하는 객체.
  done(null, user);
});
app.get('/outside/returning', function(req, res){
  // 이미 세션이 등록되어 있어 req에 user 객체가 있는 경우 home으로 이동한다.
  if(req.user){
    console.log('there is a session');
      res.redirect('/');
  }
  // 없다면 로그인 페이지 렌더링
  else{
    res.render('returning', {layout: 'none-returning'});
  }
});
// 로그인 인증 과정을 passport에 위탁
app.post('/outside/returning', passport.authenticate('local', {successRedirect: '/',
                                                               failureRedirect: '/outside/returning',
                                                               failureFlash: false})
);

app.get('/outside/moving', function(req, res){
  if(req.user){
      res.redirect('/');
  }
  else
    res.render('moving', {layout: 'none-moving'});
});
// 입력 데이터 유효성 검사
app.post('/filter/id', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err;
    else{
      connection.query('SELECT mbr_Id FROM member where mbr_Id = ?', req.body.input_Id, function(err, rows){
        if (err) throw err;
        else{
          res.json({isThere: rows.length});
        }
        connection.release();
      });
    }
  });
});
app.post('/filter/nick', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err;
    else{
      connection.query('select mbr_Nick from member where mbr_Nick = ?', req.body.input_Nick, function(err, rows){
        if (err) throw err;
        else{
          res.json({isThere: rows.length});
        }
        connection.release();
      });
    }
  });
});
app.post('/filter/email', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      connection.query('select mbr_Email from member where mbr_Email = ?', req.body.input_Email, function(err, rows){
        if(err) throw err;
        else{
          res.json({isThere: rows.length});
        }
        connection.release();
      });
    }
  });
});
// 인증 메일 전송
app.post('/filter/verify', function(req, res){
  // 랜덤으로 8자리 수를 만들어 인증 코드로 사용
  var code = Math.floor(Math.random() * 8999999 + 1000000).toString();
  hasher({password: code}, function(err, pass, salt, hash){
    if (err) throw err;
    // 인증 url 전송
    hash = hash.replace(/\//g, '');
    emailService.sendCode(req.body.user, 'localhost:3001/auth/' + hash);
    res.json({code: hash});
  });
  // salt와 salt + key의 암호화 값을 세션에 저장했다가 사용자가 인증 코드를 입력하면 비교한 뒤 삭제하도록 한다.
});
// 인증 코드 검사 결과 반환 및 데이터 저장 : url 인증 방식으로 변경
// app.post('/filter/code', function(req, res){
//   var check;
//   console.log('body inputCode : ' + req.body.input_Code);
//   console.log('session salt : ' + req.session.salt)
//   hasher({password: req.body.input_Code, salt: req.session.salt}, function(err, pass, salt, hash){
//     if (err) throw err;
//     console.log('hash : ' + hash);
//     console.log('key : ' + req.session.key);
//     // console.log('session key' + req.session.key);
//     if (hash == req.session.key)
//       res.json({result : check = true});
//     else {
//       res.json({result : check = false});
//     }
//   });
// });
app.get('/auth/:code', function(req, res){
  console.log('into!!!');
  pool.getConnection(function(err, connection){
    if (err) throw err;
    console.log(req.params.code);
    connection.query('SELECT * FROM member WHERE mbr_Code = ?', req.params.code, function(err, rows){
      if(err) throw err;
      // db에 코드를 가지는 회원이 없을 때
      if(!rows[0]){
        res.render('auth-not-valid', {layout:'none'});
      }
      // 이미 인증된 회원이라면 로그인 페이지로 이동
      else if(rows[0].mbr_Verified){
        res.render('auth-already', {layout:'none', nick: rows[0].mbr_Nick});
      }
      // 코드에 해당하는 회원을 찾았을 경우 인증됨으로 갱신
      else if(rows[0]){
        console.log('find!');
        connection.query('UPDATE member SET mbr_Verified = 1 WHERE mbr_Code = ?', req.params.code, function(err, rows){
          if (err) throw err;
        });
        connection.query('UPDATE member SET mbr_Code = "" WHERE mbr_Code = ?', req.params.code, function(err, rows){
          if (err) throw err;
        });
        res.render('auth-verify', {layout:'none', nick: rows[0].mbr_Nick});
      }
    });
    connection.release();
  });
});
// 입력 데이터 저장
app.post('/outside/moving', function(req, res){
  console.log('into');
  var dbSet;
  hasher({password: req.body.user.pwd}, function(err, pass, salt, hash){
    dbSet = {mbr_Id: req.body.user.id, mbr_Pwd: hash, mbr_Salt: salt, mbr_Code: req.body.codes , mbr_Nick: req.body.user.nick, mbr_EMail: req.body.user.email};
    pool.getConnection(function(err, connection){
      if(err) throw err;
      else{
        console.log('saveinto');
        connection.query("INSERT INTO member SET ?", dbSet,
        function(err, rows){if(err) console.log('Query Error: ' + err); else console.log('Query Success');});
      }
      connection.release();
      console.log('out');
      res.redirect('/outside/returning');
    });
  });
  console.log('outt');
  // filter에서 유효성 검사를 진행하고, 유효한 값이 아닐 경우 값 전송 자체가
  // 막히기 때문에 요청이 들어오는 경우는 무조건 redirect하면 된다.
    // res.redirect('/outside/returning');
});

app.get('/', function(req, res){
  if(!req.user){
      res.redirect('/outside/returning');
  }
  else{
    // emailService.sendKey('cyzhtkxkd50@naver.com', )
    pool.getConnection(function(err, connection){
      if(err) throw err;
      else{
        connection.query('select brd_Title from board', function(err, rows){
          _boards = '<li><a href="/" class="room-list active-board">front-door</a></li>';
          for(var i in rows){
            _boards += '<li><a href="/front-door/"' + rows[i].brd_Title + ' class="room-list inactive-board">' + rows[i].brd_Title + '</a></li>';
          }console.log('Get boards menu');
          // getConnection 함수 밖에 렌더 함수를 쓰면 비동기 방식이기 때문에 게시판 항목을 모두 읽어오기 전 렌더링을 해버린다.
          res.render('front-door', {boards: _boards});
        });
      }
      connection.release();
    });
  }
});
app.post('/board/verify', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err;
    connection.query('SELECT brd_Opened FROM board WHERE brd_Title = ?', req.body['brd-title'], function(err, rows){
      if (err) throw err;
      if (rows[0].brd_Opened)
        res.json({Opened : true});
      else
        res.json({Opened: false});
    });
    connection.release();
  });
});
app.post('/board/verify-check', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err;
    connection.query('SELECT * FROM board WHERE brd_Title = ?', req.body['brd-title'], function(err, rows){
      if (err) throw err;
      hasher({password: req.body['input-pass'], salt: rows[0].brd_Salt}, function(err, pass, salt, hash){
        if (err) throw err;
        if(hash == rows[0].brd_Pwd){
          res.json({result: true});
        }
        else {
          res.json({result: false});
        }
      });
    });
    connection.release();
  });
});
app.post('/Page', function(req, res){
  // TODO 중복 코드 모듈화 가능한지 생각 : 그냥 통짜로 모듈화 했을 땐 rows 등의 변수를 사용 못함
  // ** 익명함수 function(req, res){...}를 모듈화 하는 방법. -> 모듈 함수에 인자를 req, res로ㅇㅇ
  pool.getConnection(function(err, connection){
    if(err) throw err;

    if(req.body.cBoard == 'front-door'){
      connection.query('SELECT COUNT(*) AS totalCount FROM post', function(err, rows){
        if (err) throw err;

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
        res.json({cPage:parseInt(req.body.cPage), sPage:startPage, ePage:endPage, tPage:totalPage});

      });
    }
    else{
      connection.query('SELECT COUNT(*) AS totalCount FROM post WHERE brd_Title = ?', req.body.cBoard, function(err, rows){
        if(err) throw err;

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
        res.json({cPage:parseInt(req.body.cPage), sPage:startPage, ePage:endPage, tPage:totalPage});
      });
    }
  });
});
app.post('/Post', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    if(req.body.cBoard == 'front-door'){
      connection.query('SELECT brd_Title, pst_Date, pst_Id, pst_Title, pst_View, pst_Writer FROM post LIMIT ?, 10', (parseInt(req.body.cPage)-1) * 10, function(err, rows){
        if(err) throw err;

        res.json(rows);
        connection.release();
      });
    }
    else{
      connection.query('SELECT brd_Title, pst_Date, pst_Id, pst_Title, pst_View, pst_Writer FROM post WHERE brd_Title = ? LIMIT ?, 10', [req.body.cBoard, (parseInt(req.body.cPage)-1) * 10], function(err, rows){
        if(err) throw err;

        res.json(rows);
        connection.release();
      });
    }
  });
});
app.post('/view-post', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err;
    else{
      connection.query('SELECT * FROM post WHERE pst_Id = ?', req.body.cPost, function(err, rows){
        if(err) throw err;
        else{
          if(!rows[0])
            res.json({pst_Id: 'none', brd_Title: 'none', pst_Writer: 'none', pst_View: 'none', pst_Date: 'none', pst_Title: 'There is no post any more', pst_Content: 'Nothing to show'});
          else
            res.json(rows[0]);
        }
        connection.release();
      });
    }
  });
});

app.post('/outside/building-room', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err;
    else{
      connection.query('SELECT CAST(mbr_Nick AS CHAR) AS mbr_Nick, mbr_Chance FROM member WHERE mbr_Nick = ?', req.user.mbr_Nick, function(err, rows){
        if (err) throw err;
        else{
          console.log(rows[0]);
          if(req.body['brd-opened'] == 'open')
           req.body['brd-opened'] = 1;
          else {
            req.body['brd-opened'] = 0;
          }
          if(!rows[0].mbr_Chance){
            hasher({password: req.body['brd-password']}, function(err, pass, salt, hash){
              if(err) throw err;
              connection.query('INSERT INTO board VALUES (?, default, ?, ?, ?, default, ?)', [req.body['brd-title'], hash, salt, req.body['brd-opened'], req.user.mbr_Nick], function(err, rows){if (err) throw err;});
            });
            connection.query('INSERT INTO post VALUES (?, default, "Read me", ?, default, ?, default)', [req.body['brd-title'], req.body['brd-explain'], req.user.mbr_Nick], function(err, rows){if (err) throw err;});
            connection.query('UPDATE member SET mbr_Chance = 1 WHERE mbr_Nick = ?', req.user.mbr_Nick, function(err, rows){if (err) throw err;});
          }
          else{
            console.log('You\'ve made board before');
          }
        }
        connection.release();
      });
    }
  });
  // TODO 게시판 새로고침 안됨
  res.redirect(req.get('referer'));
});

app.get('/outside', function(req, res){
  req.logout();
  res.redirect('/outside/returning');
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
