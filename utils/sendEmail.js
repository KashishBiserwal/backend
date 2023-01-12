const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })
    const message = {
        from: process.env.SMTP_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    const info = await transporter.sendMail(message);
    console.log(`Message sent: ${info.messageId}`);
}

module.exports = sendEmail;