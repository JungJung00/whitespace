module.exports = function(app, pool){
  app.get('/member/customize', function(req, res){
    res.render('member-customize-template', {mbr_Nick: req.user.mbr_Nick});
  });
}
