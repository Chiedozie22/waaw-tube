const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        pass: '',
        user: 'justinfisher991@gmail.com',
    },
    tls: {
        rejectUnauthorized: false,
    }
    });


module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({from, subject, to, html}, (err, info) => {
                if (err) reject(err);
                resolve(info);
            });
        });
    }
}    