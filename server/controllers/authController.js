import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateOTP } from '../utils/generateOTP.js';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Helper function to format user response
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isVerified: user.isVerified,
  plan: user.plan,
  createdAt: user.createdAt
});

// signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (user && !user.isVerified) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const otpCode = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.name = name;
      user.password = hashedPassword;
      user.otp = { code: otpCode, expiresAt: otpExpiry };
      await user.save();

      await sendEmail(
        email,
        'Resend OTP - Synapse AI ',
        `<h2>Hi ${name},</h2><p>Your new OTP is <strong>${otpCode}</strong></p>`
      );

      return res.status(200).json({ 
        message: 'New OTP sent to your email',
        user: formatUserResponse(user)
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: { code: otpCode, expiresAt: otpExpiry },
    });

    await sendEmail(
      email,
      'Verify your Synapse AI account',
      `<h2>Welcome to Synapse AI, ${name}!</h2><p>Your OTP: <strong>${otpCode}</strong></p>`
    );

    res.status(201).json({ 
      message: 'Signup successful. OTP sent to email',
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// otp verification
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const { code, expiresAt } = user.otp || {};
    if (!code || !expiresAt) return res.status(400).json({ message: 'No OTP requested' });
    if (code !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > new Date(expiresAt)) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Email verified successfully',
        token,
        user: formatUserResponse(user)
      });
  } catch (err) {
    console.error('OTP Verification Error:', err);
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email before logging in' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Login successful',
        token,
        user: formatUserResponse(user)
      });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendEmail(
      email,
      'Reset Your Synapse AI Password',
      `
        <h3>Reset Password OTP</h3>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
      `
    );

    res.status(200).json({ 
      message: 'OTP sent to email',
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { code, expiresAt } = user.otp || {};
    if (!code || !expiresAt) return res.status(400).json({ message: 'No OTP requested' });
    if (otp !== code) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > new Date(expiresAt)) return res.status(400).json({ message: 'OTP expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ 
      message: 'Password reset successfully',
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

// change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ 
      message: 'Password changed successfully',
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ 
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ 
      message: "Failed to fetch profile",
      error: err.message 
    });
  }
};