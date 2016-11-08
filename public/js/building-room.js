function buildingRoom(){
  var template = '';
  var prepostList = $('#prepost-template-target');

  $.ajax({
    url: '/js/template/building-room-template.handlebars',
    success: function(data){
      $.ajax({
        url: '/write-post/boards',
        type: 'post',
        success: function(value){
          template = Handlebars.compile(data, {'post-write-boards': value});
          prepostList.html(template);
          $('#write-post-wrapper').css('display', 'none');
          $('#page').empty();
        }
      });
    }
  });
}
