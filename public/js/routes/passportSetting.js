var hasher = require('pbkdf2-password')();

module.exports = function(passport, LocalStrategy, pool){
  // 자체 회원 인증
  passport.use(new LocalStrategy(
    function(username, password, done){
      pool.getConnection(function(err, connection){
          if(err) throw err;
          else{
            // TODO 입력 틀렸을 경우 페이지 만들기
            // 로그인 처리
            connection.query('SELECT CAST(mbr_Id AS CHAR) AS mbr_Id, mbr_Pwd, mbr_Salt, CAST(mbr_Nick AS CHAR) AS mbr_Nick, mbr_Email,\
                              mbr_Verified, mbr_Chance, mbr_Date FROM member WHERE mbr_Id = ?', username, function(err, rows){
              console.log(username + ' ' + password);
              console.log(rows);
              if(err){
                console.log('Query Error: ' + err);
                return done(null, false);
              }
              else{
                // 아이디 불일치
                if(!rows.length){
                  console.log('\n\nThere is no ID that you typed');
                  return done(null, false);
                }
                // 비인증 아이디
                else if(!rows[0].mbr_Verified){
                  console.log('Not verified. Please check your mail');
                  return done(null, false);
                }
                else{
                  return hasher({password: password, salt: rows[0].mbr_Salt}, function(err, pass, salt, hash){
                    // 아이디, 비밀번호 일치
                    if(hash == rows[0].mbr_Pwd){
                      // 회원 정보를 serializeUser(callback)에 보낸다.
                      console.log(rows[0]);
                      done(null, rows[0]);
                    }
                    // 비밀번호 불일치
                    else{
                      console.log('\n\nWrong password');
                      done(null, false);
                    }
                  });
                }
              }
            });
          }
          connection.release();
        });
    }
  ));
  // done이 false가 아닐 경우 실행
  // 사용자의 세션(닉네임)을 저장한다.
  passport.serializeUser(function(user, done){
    console.log('serial user : ' + user.mbr_Nick);
    done(null, user);
  });
  // 세션이 이미 저장되어 있을 경우 req에 user 객체를 추가한다.
  passport.deserializeUser(function(user, done){
    // req의 객체 user에 저장. user객체는 passport가 새로 추가하는 객체.
    done(null, user);
  });
}
