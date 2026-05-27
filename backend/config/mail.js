import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});


transporter.verify((err) => {
  if (err) {
    console.log("SMTP ERROR:", err);
  } else {
    console.log("SMTP CONNECTED");
  }
});


const sendEmail = async (sender, otp) => {
  try {
    await transporter.sendMail({
      from: `Insta Clone Pro <shlok73727@gmail.com>`,
      to: sender,
      subject: "Reset Your Password",
      html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; padding: 40px 20px;">
        <div style="max-width: 400px; margin: auto; background: white; border: 1px solid #dbdbdb; border-radius: 8px; padding: 30px; text-align: center;">
          
          <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 20px; color: #262626; letter-spacing: -1px;">
            Approve
          </h1>
          
          <p style="color: #8e8e8e; font-size: 16px; margin-bottom: 20px;">
            To reset your password, please enter otp:
          </p>
          
          <div style="background: #fdfdfd; border: 1px solid #efefef; border-radius: 4px; padding: 15px; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: 700; color: #262626; letter-spacing: 10px;">
              ${otp}
            </span>
          </div>
          
          <p style="font-size: 14px; color: #8e8e8e; line-height: 18px;">
            If you didn't request this otp, you can safely ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #8e8e8e; font-size: 12px;">
          © 2026 insta-clone FROM SHLOK
        </div>
      </div>
      `,
    });

    console.log("OTP EMAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.log("EMAIL ERROR:", error);
    throw error;
  }
};

export default sendEmail;