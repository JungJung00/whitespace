function pagingN(board, _cPage){
  $.ajax({
    url: '/Page',
    type: 'post',
    data: {cBoard: board, cPage: _cPage},
    dataType: 'json',
    success: function(data){
      $(document).ready(function(){
        $('#page').empty();

        // 페이지 표시
        if(data['cPage'] >= 5) $('#page').append('<li><a href="/' + board + '/1" class="page">1 </a></li>');
        if(data['cPage'] >= 6) $('#page').append('<li><a href="/' + board + '/' + (data['sPage'] - 1) + '" class="page"> ... </a></li>');

        for(var i = data['sPage']; i <= data['ePage']; i++){
          if(i == data['cPage'])
            // 현재 페이지를 다시 눌렀을 때 또 값을 불러올 필요는 없으므로 경로 제거
            $('#page').append('<li><a class="page"><b>' + i + '</b></a></li>' + " ");
          else{
            $('#page').append('<li><a href="/' + board + '/' + i + '" class="page">' + i + '</a></li>' + " ");
            if(i == data['ePage'] && data['tPage']>data['ePage']){
              $('#page').append('<li><a href="/' + board + '/' + (data['ePage'] + 1) + '" class="page">...</a></li> ');
            }
          }
        }
        // TODO 마지막 페이지 눌렀을 때 같은 번호 두 개 생성
        $('#page').append('<li><a href="/' + board + '/' + data['tPage'] + '" class="page">' + data['tPage'] + '</a></li>');
      });
    }
  });
}
