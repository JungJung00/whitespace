function viewPost(Id){
  var pTemplate;  // post 템플릿
  var cTemplate;  // comment 템플릿
  var $postList = $('#viewpost-template-target');  // 템플릿 함수 작업까지 마친 값을 넣을 div
  var cmntList = '';  // comment 값을 임시로 저장할 변수
  // comment 마지막에 추가할 comment 입력 칸
  var comment = '<form id="comment-form" name="comment-submitter" action="/write-comment" method="post">\
                <input type="hidden" name="pst_Id" value="">\
                <li class="prepost-wrapper">\
                <div class="prepost prepost-comment-title">\
                <span class="prepost-small">댓글</span>\
                <br>\
                <textarea type="text" name="cmnt_Content" plcaeholder="Type comment"></textarea>\
                </div>\
                <div class="prepost prepost-comment-detail">\
                <button>Leave a comment</button>\
                </div>\
                </li>\
                </form>';

  // /js/template 폴더에 있는 post 템플릿 파일을 불러온다.
  $.ajax({
    url: '/js/template/post-template.handlebars',
    success: function(data){
      pTemplate = Handlebars.compile(data);
    }
  });
  // 인자로 받은 post id를 통해 데이터베이스에서 post를 불러온다.
  $.ajax({
    url: '/view-post',
    type: 'post',
    data: {cPost: Id},
    dataType: 'json',
    success: function(data){
      data.pst_Date = data.pst_Date.replace("T", ' ').replace('.000Z', '')
                                   .replace('-', '.').replace('-', '.');
      $postList.empty();
      $postList.html(pTemplate(data));
      /* 여기가 post view가 화면에 뿌려준 상태. 이제 아래에서 comment를 뿌려준다. */

      $.ajax({
        url: '/js/template/post-comment-template.handlebars',
        success: function(data){
          cTemplate = Handlebars.compile(data);
        }
      });
      // 해당 post의 comment를 가져온다.
      $.ajax({
        url: '/view-post-comment',
        type: 'post',
        data:{postId : Id},
        dataType:'json',
        success: function(data){
          $.each(data, function(index, value){
            cmntList += cTemplate(value);
          });
          cmntList += comment;

          $('#post-comment').empty();
          $('#post-comment').html(cmntList);
          /* 여기가 댓글까지 뿌려준 상태이다. */

          // hidden input의 value를 post id로 지정해준다.
          // form submit 할 때 post id도 같이 전해주기 위해 hidden type의 input을 만들었다.
          $('#comment-form input[type=hidden]').val(Id);
        }
      });
    }
  });
}
