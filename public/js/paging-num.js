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
        if(data['sPage'] >= 2){
          $('#page').append('<li><a href="/' + board + '/1" class="page inactive-page">1</a></li> ');
          if(data['sPage'] > 2){
            $('#page').append('<li><a href="/' + board + '/' + (data['sPage'] - 1) + '" class="page inactive-page">...</a></li> ');
          }
        }
        for(var i = data['sPage']; i <= data['ePage']; i++){
          if(i == data['cPage']){
            $('#page').append('<li><a class="page active-page"><b>' + i + '</b></a></li> ');
          }
          else{
            $('#page').append('<li><a href="/' + board + '/' + i + '" class="page inactive-page">' + i + '</a></li> ');
          }
        }
        if(data['tPage'] - data['cPage'] >= 4){
          if(data['tPage'] - data['cPage'] > 4){
            $('#page').append('<li><a href="/' + board + '/' + (data['ePage'] + 1) + '" class="page inactive-page">...</a></li> ');
          }
          $('#page').append('<li><a href="/' + board + '/' + data['tPage'] + '" class="page inactive-page">' + data['tPage'] + '</a></li> ');
        }

        if(data['ePage'] == 0 || data['tPage'] == 0){
          $('#page').append('<li><a class="page active-page">1</a></li> ');
        }
      });
    }
  });
}
