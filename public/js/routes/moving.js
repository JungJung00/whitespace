var hasher = require('pbkdf2-password')();

module.exports = function(app, pool){
  app.get('/outside/moving', function(req, res){
    if(req.user){
        res.redirect('/');
    }
    else
      res.render('moving', {layout: 'none-moving'});
  });

  // 입력 데이터 저장
  app.post('/outside/moving', function(req, res){
    var dbSet;
    hasher({password: req.body.user.pwd}, function(err, pass, salt, hash){
      dbSet = {mbr_Id: req.body.user.id, mbr_Pwd: hash, mbr_Salt: salt, mbr_Code: req.body.codes , mbr_Nick: req.body.user.nick, mbr_EMail: req.body.user.email};
      pool.getConnection(function(err, connection){
        if(err) throw err;
        else{
          connection.query("INSERT INTO member SET ?", dbSet,
          function(err, rows){if(err) console.log('Query Error: ' + err); else console.log('Query Success');});
        }
        connection.release();
      });
    });
    // can't redirect after ajax call
    // res.redirect('/outside/returning');
    res.json({redirect: '/outside/returning'});
    console.log('outt');
    // filter에서 유효성 검사를 진행하고, 유효한 값이 아닐 경우 값 전송 자체가
    // 막히기 때문에 요청이 들어오는 경우는 무조건 redirect하면 된다.
      // res.redirect('/outside/returning');
  });
}
