module.exports = function(app, pool){
  app.get('/outside', function(req, res){
    req.logout();
    res.redirect('/outside/returning');
  });
}
