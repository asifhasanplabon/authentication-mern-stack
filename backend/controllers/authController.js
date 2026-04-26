import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { generateToken } from '../utils/generateToken.js';

///helper: to generate otp;;; 6 digit
const makeOtp = () =>{
    return Math.floor(100000 + Math.random() * 900000).toString();
};
export const register = asyncHandler(async(req,res)=>{
    const { name, roll, email, password, gender, session, dept, phone} = req.body;
    const photo = req.file?.path || '';
    
    if(await User.findOne({email})){
        res.status(400);
        throw new Error("Email alread registered. Please login");
    }
    if(await User.findOne({roll})){
        res.status(400);
        throw new Error("Roll Number Already Exists");
    }
    const user = await User.create({name, roll, email, password, photo, gender, session, dept, phone });
  
    //Send verification OTP

    const otp = makeOtp();
    const expiresAt = new Date(Date.now() + 10 * 60* 1000); //10min
    await Otp.deleteMany({email, type: 'verify'});
    await Otp.create({ email, otp, type:"verify", expiresAt});
    await sendOtpEmail(email,otp,'verify');

    res.status(201).json({message: 'Registered! Checked the email for verifications'});
});  

// @route POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp, type: 'verify' });

  if (!record || record.expiresAt < new Date()) {
    res.status(400); throw new Error('Invalid or expired OTP');
  }

  await User.findOneAndUpdate({ email }, { isVerified: true });
  await Otp.deleteMany({ email, type: 'verify' });

  res.json({ message: 'Email verified successfully! You can now log in.' });
});

// @route POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.isVerified) { res.status(400); throw new Error('Already verified'); }

  const otp = makeOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await Otp.deleteMany({ email, type: 'verify' });
  await Otp.create({ email, otp, type: 'verify', expiresAt });
  await sendOtpEmail(email, otp, 'verify');

  res.json({ message: 'OTP resent to your email.' });
});

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    throw new Error("Email and password required");
}
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  if (!user.isVerified) {
    res.status(403); throw new Error('Please verify your email first');
  }

  const token = generateToken(user._id);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo },
  });
});

// @route POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) { res.status(404); throw new Error('No user with that email'); }

  const otp = makeOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await Otp.deleteMany({ email, type: 'reset' });
  await Otp.create({ email, otp, type: 'reset', expiresAt });
  await sendOtpEmail(email, otp, 'reset');

  res.json({ message: 'Password reset OTP sent to your email.', email });
});

// @route POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = await Otp.findOne({ email, otp, type: 'reset' });

  if (!record || record.expiresAt < new Date()) {
    res.status(400); throw new Error('Invalid or expired OTP');
  }

  const user = await User.findOne({ email });
  user.password = newPassword;
  await user.save();
  await Otp.deleteMany({ email, type: 'reset' });

  res.json({ message: 'Password reset successful. Please log in.' });
});

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

