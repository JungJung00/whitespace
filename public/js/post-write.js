function postWrite(){
  var template = '';
  var prepostList = $('#prepost-template-target');

  $.ajax({
    url: '/js/template/write-post-template.handlebars',
    success: function(data){
      template = Handlebars.compile(data);
    }
  });

  $.ajax({
    url: '/write-post/boards',
    type: 'post',
    dataType: 'json',
    success: function(data){
      prepostList.html(template(data));
      $('#write-post-wrapper').css('display', 'none');
      $('#page').empty();
    }
  });
}
