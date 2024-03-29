const sendEmail = require('../misc/mailer');

const verifyUserEmail = async (req, username, email, secretToken) => {
    const html = `
    Hello ${username},
    <br/>
    <br/>

    Thank you for registering an account with us at WAAWTube.
    <br/><br/>
    Please click the link below or copy to any browser to verify account:
    <br/>
    <a href="http://${req.headers.host}/auth/verify-token/${secretToken}">
    http://${req.headers.host}/auth/verify-token/${secretToken}
    <a/>

    <br/><br/>
    Kind regards,
    <br/>
    <strong>Team WAAWTube.</strong>

    `;

await sendEmail(
    'justinfisher991@gmail.com',
    email,
    "Please everify your account",
    html
);
}
module.exports = verifyUserEmail