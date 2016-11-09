function viewPost(Id){
  var template;
  var $postList = $('#viewpost-template-target');

  $.ajax({
    url: '/js/template/post-template.handlebars',
    success: function(data){
      template = Handlebars.compile(data);
    }
  });

  $.ajax({
    url: '/view-post',
    type: 'post',
    data: {cPost: Id},
    dataType: 'json',
    success: function(data){
      data.pst_Date = data.pst_Date.replace("T", ' ').replace('.000Z', '')
                                   .replace('-', '.').replace('-', '.');
      $postList.empty();
      $postList.html(template(data));
    }
  });
}
