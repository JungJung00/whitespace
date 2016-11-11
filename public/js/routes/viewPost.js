module.exports = function(app, pool){
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
}
