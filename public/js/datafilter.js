// TODO success 호출 뒤 값을 return하는 방법을 알 수가 없어 일단 async:false로 동기식으로 진행함...ㅠㅜㅠㅜㅜㅠㅜㅍ러ㅜㅊ타퍼ㅜ푸탚ㄴㅍㅌㅋㅋㅋㅌㅋㅋㅋㅋㅌㅋㅋㅋㅋ
// ID 유효성 검사
function idFilter(){
  var check = false;
  // 값이 입력되었는가
  if($('#input-id').val() == ""){
    $('#input-id + span').text('Input value').css('color', '#FF4040')
                         .fadeIn({duration: 0, queue: false});
    $('#input-id').css('border-color', '#FF4040');
    return check;
  }
  // 한글이 포함되었는가
  else if($('#input-id').val().match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/)){
    $('#input-id + span').text('Input only English or \'_\'').css('color', '#FF4040')
                         .fadeIn({duration: 0, queue: false});
    $('#input-id').css('border-color', '#FF4040');
    return check;
  }
  // 특수문자가 포함되었는가
  else if($('#input-id').val().match(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/)){
    $('#input-id + span').text('Don\'t input special letters except for \'_\'').css('color', '#FF4040')
                         .fadeIn({duration: 0, queue: false});
    $('#input-id').css('border-color', '#FF4040');
    return check;
  }
  // 공백이 포함되었는가
  else if($('#input-id').val().match(/\s/)){
    $('#input-id + span').text('Don\'t input white space').css('color', '#FF4040')
                         .fadeIn({duration: 0, queue: false});
    $('#input-id').css('border-color', '#FF4040');
    return check;
  }
  // 6 ~ 20자인가
  else if(($('#input-id').val().length < 6) || ($('#input-id').val().length > 20)){
    $('#input-id + span').text('Input value between 6 and 20 characters long').css('color', '#FF4040')
                         .fadeIn({duration: 0, queue: false});
    $('#input-id').css('border-color', '#FF4040');
    return check;
  }
  // 중복 검사
  $.ajax({
    url: '/filter/id',
    type: 'post',
    data: {input_Id: $('#input-id').val()},
    dataType: 'json',
    async: false,
    success: function(data){
      if(!data.isThere){
        $('#input-id + span').text('Accepted').css('color', '#19FF5E');
        $('#input-id').css('border-color', '#19FF5E');
        check = true;
      }
      else{
        // alert('This ID is already given. Try others.');
        $('#input-id + span').text('Already using ID. Try others').css('color', '#FF4040')
                             .fadeIn({duration: 0, queue: false});
        $('#input-id').css('border-color', '#FF4040');
      }
    }
  });
  return check;
}
// PASSWORD 유효성 검사
function pwdFilter(){
    // 값이 입력됐는가
    if($('#input-pwd').val() == ""){
      $('#input-pwd + span').text('Input value').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
      $('#input-pwd').css('border-color', '#FF4040');
      if($('#pwdck-slider').css('display') == 'block'){
        $('#input-pwdck').val('');
        $('#pwdck-slider').slideUp({duration: 800, queue: false});
      }
      return check = false;
    }
    // 대소문자, 숫자를 섞었는가
    else if(!($('#input-pwd').val().match(/[a-z]/) && $('#input-pwd').val().match(/[A-Z]/) && $('#input-pwd').val().match(/[0-9]/))){
      $('#input-pwd + span').text('Mix lower case, upper case and number').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
      $('#input-pwd').css('border-color', '#FF4040');
      if($('#pwdck-slider').css('display') == 'block'){
        $('#input-pwdck').val('');
        $('#pwdck-slider').slideUp({duration: 800, queue: false});
      }
      return check = false;
    }
    // 한글이 포함되었는가
    else if($('#input-pwd').val().match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/)){
      $('#input-pwd + span').text('Input only English or \'_\'').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
      $('#input-pwd').css('border-color', '#FF4040');
      if($('#pwdck-slider').css('display') == 'block'){
        $('#input-pwdck').val('');
        $('#pwdck-slider').slideUp({duration: 800, queue: false});
      }
      return check = false;
    }
    // 특수문자가 포함되었는가
    else if(!$('#input-pwd').val().match(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/)){
      $('#input-pwd + span').text('Mix special letters').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
      $('#input-pwd').css('border-color', '#FF4040');
      if($('#pwdck-slider').css('display') == 'block'){
        $('#input-pwdck').val('');
        $('#pwdck-slider').slideUp({duration: 800, queue: false});
      }
      return check = false;
    }
    // 공백이 포함되었는가
    else if($('#input-pwd').val().match(/\s/)){
      $('#input-pwd + span').text('Don\'t input white space').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
      $('#input-pwd').css('border-color', '#FF4040');
      if($('#pwdck-slider').css('display') == 'block'){
        $('#input-pwdck').val('');
        $('#pwdck-slider').slideUp({duration: 800, queue: false});
      }
      return check = false;
    }
    // 6 ~ 20자인가
    else if(($('#input-pwd').val().length < 6) || ($('#input-pwd').val().length > 40)){
      $('#input-pwd + span').text('Input value between 6 and 40 characters long').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
      $('#input-pwd').css('border-color', '#FF4040');
      if($('#pwdck-slider').css('display') == 'block'){
        $('#input-pwdck').val('');
        $('#pwdck-slider').slideUp({duration: 800, queue: false});
      }
      return check = false;
    }
    else{
      $('#input-pwd + span').text('Accepted').css('color', '#19FF5E');
      $('#input-pwd').css('border-color', '#19FF5E');
      $('#pwdck-slider').slideDown({duration: 800, queue: false});
      return check = true;
    }
}
// PASSWORD CHECK 유효성 검사
function pwdckFilter(){
  // pwd와 값이 다를 때
  if($('#input-pwd').val() != $('#input-pwdck').val()){
    $('#input-pwdck + span').text('It is different to above!').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
    $('#input-pwd').css('border-color', '#FF4040');
    $('#input-pwdck').css('border-color', '#FF4040');
    return check = false;
  }
  else{
    $('#input-pwdck + span').text('Accepted').css('color', '#19FF5E');
    $('#input-pwd').css('border-color', '#19FF5E');
    $('#input-pwdck').css('border-color', '#19FF5E');
    return check = true;
  }
}
// NICKNAME 유효성 검사
function nickFilter(){
  var check = false;
  // 문자열 바이트 계산
  // 한글(UTF8) : 3바이트, 영어-특수문자 : 1바이트
  function getByte(s){
    var b, i;
    var c;
    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
    return b;
  }
  if($('#input-nick').val() == ""){
    // alert('Please input data');
    $('#input-nick + span').text('Input value')
                           .fadeIn({duration: 0, queue: false});
    $('#input-nick').css('border-color', '#FF4040');
    return check;
  }
  // 6 ~ 30 바이트 외
  // 한글 10자, 영어 30자
  else if(getByte($('#input-nick').val()) < 6 || getByte($('#input-nick').val()) > 30){
    $('#input-nick + span').text('Input value between 6 and 30 Bytes long').css('color', '#FF4040')
                           .fadeIn({duration: 0, queue: false});
    $('#input-nick').css('border-color', '#FF4040');
    return check;
  }
  // 중복 검사
  $.ajax({
    url: '/filter/nick',
    type: 'post',
    data: {input_Nick: $('#input-nick').val()},
    dataType: 'json',
    async: false,
    success: function(data){
      if(!data.isThere){
        $('#input-nick + span').text('Accepted').css('color', '#19FF5E');
        $('#input-nick').css('border-color', '#19FF5E');
        check = true;
      }
      else{
        $('#input-nick + span').text('Already using Nick. Try others').css('color', '#FF4040')
                               .fadeIn({duration: 0, queue: false});
        $('#input-nick').css('border-color', '#FF4040');
      }
    }
  });
  return check;
  // connection.query('select mbr_Nick from member where mbr_Nick = ?', $('#input-nick').val(), function(err, rows){
}

// 이메일 유효성 검사
function emailFilter(){
  var check = false;
  if(!$('#input-email').val().match(/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)){
    $('#input-email + span').text('Input valid email').css('color', '#FF4040')
                            .fadeIn({duration: 0, queue: false});
    $('#input-email').css('border-color', '#FF4040');
    return check;
  }
  // 중복검사
  $.ajax({
    url: '/filter/email',
    type: 'post',
    data: {input_Email: $('#input-email').val()},
    dataType: 'json',
    async: false,
    success: function(data){
      if(!data.isThere){
        $('#input-email + span').text('Accepted').css('color', '#19FF5E');
        $('#input-email').css('border-color', '#19FF5E');
        check = true;
      }
      else{
        $('#input-email + span').text('Already using E-mail. Try others').css('color', '#FF4040')
                                .fadeIn({duration: 0, queue: false});
        $('#input-email').css('border-color', '#FF4040');
      }
    }
  });
  return check;
}

// 인증 url 이메일 전송 및 db에 값 저장
function verifyEmail(){
  var data    = $('#form-burden').serializeArray();
  var object  = {};
  // 배열 형태로 된 form 데이터를 json 객체 형태로 변환
  for (var i = 0; i < data.length; i++) {
      object[data[i].name] = data[i].value;
  }

  $.ajax({
    url: '/filter/verify',
    type: 'post',
    data: {user: $('#input-email').val()},
    dataType: 'json',
    success: function(data){
      $.ajax({
        url: '/outside/moving',
        type: 'post',
        data: {user: object, codes: data.code},
        success: function(data){
          window.location = data.redirect;
        }
      });
    }
  });

}

// function verifyCode(){
//   $.ajax({
//     url: '/filter/code',
//     type: 'post',
//     data: {input_Code: $('#input-keyck').val(), input: $('#form-burden').serialize()},
//     dataType: 'json',
//     success: function(data){
//       if(!data.result){
//         console.log('asd');
//         // $('#input-keyck + span').text('Wrong Authenticate Code. We send Code again. Check.');
//                                 // .fadeIn({duration: 1000, queue: false})
//                                 // .fadeOut({duration: 2000, queue: false});
//         verifyEmail();
//       }else{
//         moving();
//       }
//     }
//   });
// }

// function moving(code){
//
//   $.ajax({
//     url: '/outside/moving',
//     type: 'post',
//     data: {user: object, codes: code}
//   });
// }
