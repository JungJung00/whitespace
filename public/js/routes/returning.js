module.exports = function(app, passport){
  // 로그인 인증 과정을 passport에 위탁
  app.post('/outside/returning', passport.authenticate('local', {successRedirect: '/',
                                                                 failureRedirect: '/returning',
                                                                 failureFlash: false})
  );

  app.get('/outside/returning', function(req, res){
    // 이미 세션이 등록되어 있어 req에 user 객체가 있는 경우 home으로 이동한다.
    if(req.user){
      console.log('there is a session');
        res.redirect('/');
    }
    // 없다면 로그인 페이지 렌더링
    else{
      res.render('returning', {layout: 'none-returning'});
    }
  });

}
