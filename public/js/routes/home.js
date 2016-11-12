module.exports = function(app, pool){
  app.get('whtspc.herokuapp.com/', function(req, res){
    // 게시판 목록 저장
    var _boards = '';

    if(!req.user){
        res.redirect('whtspc.herokuapp.com/outside/returning');
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
}
