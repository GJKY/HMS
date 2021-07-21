var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  host: 'smtp.live.com',
  secureConnection: false,
  port: 587,
  tls: {
    ciphers:'SSLv3'
 },
  auth: {
      user: "hotelmanagementplatform@hotmail.com",
      pass: "hotelManager1"
  }
});

exports.sendEmail = function (targetEmail, message, subject) {
  
  var mailOptions = {
    from: 'The Hotel of the Future',
    to: targetEmail,
    subject: subject,
    html: message
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(info)
  })
}