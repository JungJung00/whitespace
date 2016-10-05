function boardVerify(title){
  $.ajax({
    url: '/board/verify',
    type: 'post',
    data: {'brd-title': title},
    dataType: 'json',
    success: function(data){
      if(data.Opened)
        pagingP(title, 1);
      else{
        $.ajax({
          url: '/public/js/template/board-verify.handlebars',
          success: function(data){
            template = Handlebars.compile(data);
            boardVerifyList.html(template);
          }
        });
      }
    }
  });
}
