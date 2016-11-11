module.exports = function(app, pool){
  app.post('/Page', function(req, res){
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
}
