import nodemailer from "nodemailer";

async function sendEmail({
  to = [],
  text,
  html,
  subject,
  attachments = [],
} = {}) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Software Engineer OMAR GAMAL" <${process.env.EMAIL}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
  return info.rejected.length ? false : true;
}
export default sendEmail;
