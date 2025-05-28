const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * 寄送 email
 * @param {string} to - 收件者 email
 * @param {string} subject - 主旨
 * @param {string} html - HTML 內容
 */

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Tripfolio 通知中心" <${process.env.EMAIL_ACCOUNT}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
}

module.exports = { sendEmail };
