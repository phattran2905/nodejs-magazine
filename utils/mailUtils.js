const nodemailer = require('nodemailer');

const senderAccount = {
    user: 'napoleon17@ethereal.email',
    pass: 'FYEXuxMNgYHu5NxMRb'
}

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: senderAccount.user, // generated ethereal user
    pass: senderAccount.pass // generated ethereal password
  }
});

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (sending_info) => {
    if (typeof sending_info !== "object"){
        if(!sending_info.send_to){
            throw new Error("No Email to send.")
        }
        if(!sending_info.subject){
            throw new Error("No Subject was set.")
        }
        if(!sending_info.text || !sending_info.html){
            throw new Error("No text or html content to send.")
        }
        throw new Error("The 'sending_info' must be an Object");
    }
    

    if(!sending_info.send_from){
        sending_info.send_from = senderAccount.user;
    }
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: sending_info.send_from, // sender address
      to: sending_info.send_to, // list of receivers
      subject: sending_info.subject, // Subject line
      text: sending_info.text, // plain text body
      html: sending_info.html // html body
    });
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return info;
  }

module.exports = {
    sendEmail: sendEmail
};