module.exports = function(app, pool){
  app.get('/write-post', function(req, res){
    res.render('write-post-template');
  });
  app.post('/write-post/boards', function(req, res){
        // 게시판 목록 저장
    var _boards = '';

    pool.getConnection(function(err, connection){
      if (err) throw err;
      connection.query('SELECT brd_Title FROM board', function(err, rows){
        if (err) throw err;
        if(!rows[0]){
          res.json({'post-write-boards': 'There are no boards'});
        }
        else{
          _boards = '';
          for(var i = 0; i < rows.length; i++){
            _boards += '<option value="' + rows[i].brd_Title + '">' + rows[i].brd_Title + '</option>'
          }
          res.json({'post-write-boards':_boards});
        }
        connection.release();
      });
    })
  });
  app.post('/write-post', function(req, res){
    console.log(req.body);
     pool.getConnection(function(err, connection){
       if (err) throw err;
       connection.query('INSERT INTO post VALUES (?, default, ?, ?, default, ?, default)', [req.body['post-write-board'], req.body['post-write-title'], req.body['post-write-content'], req.user.mbr_Id], function(err, rows){
         if (err) throw err;
       });
       connection.release();
       res.redirect('/');
     });
  });
}
