function pagingP(board, _cPage){
  var template;
  var prepostList = $('#prepost-template-target')
  var prepost = '';

  // load external template
  // 템플릿을 인라인으로 작성하면 handlebars parser가 이미 지나간 후이기 때문에 값이 들어가지 않는다
  // => 확실X TODO 템플릿 인라인 문제 정확하게 검색해서 알아보기
  // AJAX 통신으로 외부 템플렛을 불러온다.
  $.ajax({
    url: '/js/template/prepost-template.handlebars',
    success: function(data){
      template = Handlebars.compile(data);
    }
  });

  $.ajax({
    url: '/Post',
    type: 'post',
    data: {cBoard: board, cPage: _cPage},
    dataType: 'json',
    success: function(data){
      $.each(data, function(index, value){
        // yyyy-MM-dd'T'HH:mm:ss.SSSz to yyyy.MM.dd HH:mm:ss
        value.pst_Date = value.pst_Date.replace("T", ' ').replace('.000Z', '')
                                       .replace('-', '.').replace('-', '.');
        console.log(value);
        prepost += template(value);
        console.log('\n'+'prepost : ' + prepost);
      });
      prepostList.html(prepost);
    }
  });
  pagingN(board, _cPage);
}
