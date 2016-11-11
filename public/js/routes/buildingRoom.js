var hasher = require('pbkdf2-password')();

module.exports = function(app, pool){
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
}
