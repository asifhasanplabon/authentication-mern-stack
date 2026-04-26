import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        // user: "songkolpo01@gmail.com",
        // pass: "jaslldnhyjwxgzyr",
    },
});

export const sendOtpEmail = async (to, otp, type='verify')=>{
    const subject = type ==='verify' 
    ? 'Email Verification otp'
    : 'Password Reset Otp';

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
        <div style="background:#1a56db;padding:20px;text-align:center">
        <h2 style="color:#fff;margin:0">Library Management system
        </h2>
        </div>
        <div style="padding: 30px">
        <p style="font-size:16px">Your ${type === 'verify' ? 'email verification' : 'password reset'} OTP is:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:12px;text-align:center;
                    background:#f3f4f6;padding:16px;border-radius:8px;margin:20px 0">
          ${otp}
        </div>
        <p style="color:#666;font-size:13px">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div> 
    </div>
    `;
    await transporter.sendMail({
        from:`"JKKNIU LIBRARY <${process.env.EMAIL_USER}>`, to, subject, html
    });


};