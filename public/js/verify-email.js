var nodemailer = require('nodemailer');

module.exports = function(credentials){
  var mailTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: credentials.gmail.user,
      pass: credentials.gmail.password
    }
  });

  var mailFrom = '"White Space" <DO NOT REPLY>';
  var errorRecipient = 'watermmm12@gmail.com';
  return {
    sendCode: function(to, key){
      mailTransport.sendMail({
        from: mailFrom,
        to: to,
        subject: 'White Space - Your Authenticate Key',
        html: '<h3>Please input below Authenticate Key</h3><br>' +
              '<span style="font-size:70px;line-height:0.4em;opacity:0.7">&#10077;</span>' +
              '<span style="font-size:30px"> ' + key + ' </span>' +
              '<span style="font-size:70px;line-height:0.4em;opacity:0.7">&#10078;</span>',
        generateTextFromHtml: true
      }, function(err){
        if (err) throw err;
      })
    }
  };
}
