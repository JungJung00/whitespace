module.exports = function(app, pool){
  app.post('/Post', function(req, res){
    pool.getConnection(function(err, connection){
      if(err) throw err;
      if(req.body.cBoard == 'front-door'){
        connection.query('SELECT B.brd_Title, B.pst_Date, B.pst_Id, B.pst_Title, B.pst_View, B.pst_Writer FROM (SELECT pst_Id FROM post ORDER BY pst_Id DESC LIMIT ?, 10) A JOIN post B ON A.pst_Id = B.pst_Id', (parseInt(req.body.cPage)-1) * 10, function(err, rows){
          if(err) throw err;
          res.json(rows);
          connection.release();
        });
      }
      else{
        console.log('현재 게시판 : ' + req.body.cBoard);
        console.log('현재 번호 : + ' + parseInt(req.body.cPage));
        connection.query('SELECT B.brd_Title, B.pst_Date, B.pst_Id, B.pst_Title, B.pst_View, B.pst_Writer FROM (SELECT pst_Id FROM post WHERE brd_Title = ? ORDER BY pst_Id DESC LIMIT ?, 10) A JOIN post B ON A.pst_Id = B.pst_Id', [req.body.cBoard, (parseInt(req.body.cPage)-1) * 10], function(err, rows){
          if(err) throw err;
          res.json(rows);
          connection.release();
        });
      }
    });
  });
}
