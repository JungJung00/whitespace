var hasher = require('pbkdf2-password')();

module.exports = function(app, pool, emailService){
  // 입력 데이터 유효성 검사
  app.post('/filter/id', function(req, res){
    pool.getConnection(function(err, connection){
      if (err) throw err;
      else{
        connection.query('SELECT mbr_Id FROM member WHERE mbr_Id = ?', req.body.input_Id, function(err, rows){
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
        connection.query('SELECT mbr_Nick FROM member WHERE mbr_Nick = ?', req.body.input_Nick, function(err, rows){
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
        connection.query('SELECT mbr_Email FROM member WHERE mbr_Email = ?', req.body.input_Email, function(err, rows){
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
}
