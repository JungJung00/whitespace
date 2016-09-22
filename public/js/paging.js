function paging(board){
  $.ajax({
    url: '/' + board,
    type: 'post',
    data: {cPage: 1},
    dataType: 'json',
    success: function(data){
      $(document).ready(function(){
        // 페이지 표시
        if(data['cPage'] >= 5) $('#page').append('<a href="/' + board + '/1">1 </a>');
        if(data['cPage'] >= 6) $('#page').append('<a href="/' + board + '/' + (data['sPage'] - 1) + '"> ... </a>');

        for(var i = data['sPage']; i <= data['ePage']; i++){
          if(i == data['cPage'])
          $('#page').append('<a href="/' + board + '/' + i + '"><b>' + i + '</b></a>' + " ");
          else{
            $('#page').append('<a href="/' + board + '/' + i + '">' + i + '</a>' + " ");
            if(i == data['ePage'] && data['tPage']>data['ePage']){
              $('#page').append('<a href="/' + board + '/' + (data['ePage'] + 1) + '">...</a> ');
            }
          }
        }
        $('#page').append('<a href="/' + board + '/' + data['tPage'] + '">' + data['tPage'] + '</a>');
      });
    }
  });
}
