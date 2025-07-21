const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
// ✅ Correct

dotenv.config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;
const templatePath = "C:/Users/mkjap/OneDrive/Desktop/lms-mega-project/server/mails/activation-email.ejs";
const html = await ejs.renderFile(templatePath, data);


  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;