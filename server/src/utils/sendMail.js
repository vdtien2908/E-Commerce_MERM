const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Smile Shop 👻" <no-reply@smile-shop.com>', // sender address
        to: email, // list of receivers
        subject: 'Forgot password ✔', // Subject line
        html: html, // html body
    });

    return info;
});

module.exports = sendMail;
