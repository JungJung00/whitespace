// TODO alert 대신 메시지 사용자에게 표시할 방법 생각하기.
// => 폼에 입력하고 포커스 아웃 했을 때 값 비교?
exports.dataFilter = function(data, connection){
  var check = false;
  /*
   * 한글 검사 : [ㄱ-ㅎㅏ-ㅣ가-힣]
   * 특수 문자 및 공백 문자: [\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s]
   * 이메일 : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
  */

  // ID 유효성 검사
  // 값이 입력되었는가
  if(data.id == ""){
    alert('Please input data');
    return check;
  }
  // 한글이 포함되었는가
  else if(data.id.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/)){
    alert('Please input only English with special letter \'_\'');
    return check;
  }
  // 특수문자나 공백이 포함되었는가
  else if(!data.id.match(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"\s]/)){
    alert('Don\'t input special letters except for \'_\' or white space');
    return check;
  }
  // 중복 검사
  connection.query('select mbr_Id from member where mbr_Id = ?', data.id, function(err, rows){
    if(rows.length != 0){
      alert('This ID is already given. Try others.');
    }
    else{
      // TODO input border 색 초록으로 바꾸기
      check = true;
    }
  });
  if(check == false) return check;

  check = false;
  // PASSWORD 유효성 검사
    if(data.pwd == ""){
      alert('Please input data');
      return check;
    }
    // 대소문자를 섞었는가
    else if(!(data.pwd.match(/[a-z]/) && data.pwd.match(/[A-Z]/) && data.pwd.match(/[0-9]/))){
      alert('Please mix lower case, upper case and number');
      return check;
    }
    // 한글이 포함되었는가
    else if(data.pwd.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/)){
      alert('Please input only English with special letters');
      return check;
    }
    // 특수문자가 포함되었는가
    else if(!data.pwd.match(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/)){
      alert('Please mix special letters');
      return check;
    }
    // 6 ~ 20자인가
    else if(!data.pwd.match(/[a-zA-Z0-9_]{6,20}/)){
      alert('Please input only 6 ~ 20 letters');
      return check;
    }
    else{
      // TODO 비밀번호 확인 input 만들기. 맞으면 border 녹색으로
      check = true;
    }
    if(check == false) return check;

  // NICKNAME 유효성 검사
    check = false;
    // 중복 검사
    connection.query('select mbr_Nick from member where mbr_Nick = ?', data.nick, function(err, rows){
      if(rows.length != 0){
        alert('This Nickname is already given. Try others.');
      }
      else{
        // TODO border 녹색으로
        check = true;
      }
    });
    if(check == false) return check;

  // E-MAIL 유효성 검사
    check = false;
    // 이메일 유효성 검사
    if(!data.email.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)){
      alert('Please input valid email');
      return check;
    }
    // 중복검사
    connection.query('select mbr_Email from member where mbr_Email = ?', data.email, function(err, rows){
      if(rows.length){
        alert('This Email is already using. Try others.');
      }
      else{
        // TODO border 녹색으로
        check = true;
      }
    });
    if(check == false) return check;

    // 검사가 끝났으므로 무조건 retrun
    // false : 비유효  true : 유효
    return check;
}
