module.exports = function(app, pool){
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
}
