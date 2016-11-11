var hasher = require('pbkdf2-password')();

module.exports = function(app, pool){
  app.post('/board/verify', function(req, res){
    if(req.body['brd-title'] == 'front-door')
      res.json({Opened:true});
    else{
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
    }
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
}
