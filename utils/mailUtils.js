const nodemailer = require("nodemailer")
const commonUtils = require("./commonUtils")

const senderAccount = {
        user: "napoleon17@ethereal.email",
        pass: "FYEXuxMNgYHu5NxMRb",
}

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
                user: senderAccount.user, // generated ethereal user
                pass: senderAccount.pass, // generated ethereal password
        },
})

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (sending_info) => {
        if (typeof sending_info !== "object") {
                throw new Error("The 'sending_info' must be an Object")
        }

        // Destructing "sending_info"
        let {send_to, subject, text, html, send_from} = sending_info

        if (!send_to) {
                throw new Error("No Email to send.")
        }
        if (!subject) {
                throw new Error("No Subject was set.")
        }
        if (!text || !html) {
                throw new Error("No text or html content to send.")
        }

        if (!send_from) {
                send_from = senderAccount.user
        }

        // send mail with defined transport object
        let info = await transporter.sendMail({
                from: sending_info.send_from, // sender address
                to: sending_info.send_to, // list of receivers
                subject: sending_info.subject, // Subject line
                text: sending_info.text, // plain text body
                html: sending_info.html, // html body
        })
        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        // console.log(nodemailer.getTestMessageUrl(info));
        return {
                info: info,
                testMailURL: nodemailer.getTestMessageUrl(info),
        }
}

const sendVerificationEmail = async (email, token) => {
        let sending_info = {
                send_to: email,
                subject: "Verify account",
                text:
                        "Verification email. Please verify your account through this link http://localhost:5000/verify/" +
                        commonUtils.normalizeVerifyToken(token),
                html:
                        '<h2>Verification email</h2><a href="localhost:5000/verify/' +
                        commonUtils.normalizeVerifyToken(token) +
                        '">Click this link to verify</a>',
        }
        try {
                const response = await sendEmail(sending_info)
                if (response) return response
                return null
        } catch (error) {
                return null
        }
}

const sendResetPwdEmail = async (email, token) => {
        let sending_info = {
                send_to: email,
                subject: "Reset your password",
                text:
                        "To reset your password and set up a new one. Please access this link http://localhost:5000/reset_pwd/ ." +
                        commonUtils.normalizeVerifyToken(token),
                html:
                        '<h2>Reset your password here </h2><a href="localhost:5000/reset_pwd/' +
                        commonUtils.normalizeVerifyToken(token) +
                        '">Click this link to set up a new password</a>',
        }
        try {
                const response = await sendEmail(sending_info)
                if (response) return response
                return null
        } catch (error) {
                return null
        }
}

module.exports = {
        sendEmail: sendEmail,
        sendVerificationEmail: sendVerificationEmail,
        sendResetPwdEmail: sendResetPwdEmail,
}
