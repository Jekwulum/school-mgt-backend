const nodemailer = require('nodemailer');

const mailTransporter = async () => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    },
  });

  return transporter;
};

module.exports = mailTransporter;