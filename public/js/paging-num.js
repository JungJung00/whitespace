function pagingN(board, _cPage){
  $.ajax({
    url: '/' + board + 'N',
    type: 'post',
    data: {cPage: _cPage},
    dataType: 'json',
    success: function(data){
      $(document).ready(function(){
        $('#page').empty();

        // 페이지 표시
        if(data['cPage'] >= 5) $('#page').append('<a href="/' + board + '/1" class="page">1 </a>');
        if(data['cPage'] >= 6) $('#page').append('<a href="/' + board + '/' + (data['sPage'] - 1) + '" class="page"> ... </a>');

        for(var i = data['sPage']; i <= data['ePage']; i++){
          if(i == data['cPage'])
          $('#page').append('<a href="/' + board + '/' + i + '" class="page"><b>' + i + '</b></a>' + " ");
          else{
            $('#page').append('<a href="/' + board + '/' + i + '" class="page">' + i + '</a>' + " ");
            if(i == data['ePage'] && data['tPage']>data['ePage']){
              $('#page').append('<a href="/' + board + '/' + (data['ePage'] + 1) + '" class="page">...</a> ');
            }
          }
        }
        $('#page').append('<a href="/' + board + '/' + data['tPage'] + '" class="page">' + data['tPage'] + '</a>');
      });
    }
  });
}
