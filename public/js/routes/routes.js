var fs = require('fs');

module.exports = function(app, pool, passport, LocalStrategy, emailService){
  // require every router
  fs.readdirSync(__dirname).forEach(function(file){
    // in forEach loop, js 'return' acts like continue
    var name = file.substr(0, file.indexOf('.'));

    // 인자값 문제로 몇 개는 따로 require을 한다. TODO 더 좋은 방법이 있을까..?
    if(file == 'routes.js') return;
    else if(file == 'passportSetting.js') require('./' + name)(passport, LocalStrategy, pool);
    else if(file == 'returning.js') require('./' + name)(app, passport);
    else if(file == 'filter.js') require('./' + name)(app, pool, emailService);
    else{
      require('./' + name)(app, pool);
    }
  });
}
