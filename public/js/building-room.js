function buildingRoom(){
    var template = '';
    var prepostList = $('#prepost-template-target');

    $.ajax({
      url: '/js/template/building-room-template.handlebars',
      success: function(data){
        template = Handlebars.compile(data);
        prepostList.html(template);
        $('#write-post-wrapper').css('display', 'none');
        $('#page').empty();
      }
    });
}
