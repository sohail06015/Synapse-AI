// controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  const options = {
    amount: 49900, // ₹499.00
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.log("❌ Signature mismatch");
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isPremium = true;
    await user.save();

    // ✅ Email on success
    const subject = " Congratulations, Synapse AI Premium Plan Activated!";
    const html = `
      <h2>Hi ${user.name},</h2>
      <p>Your payment was successful and your account is now upgraded to <strong>Premium</strong>.</p>
      <p>You now have full access to image generation, background remover, resume review, and more!</p>
      <p>Thank you for choosing <strong>Synapse AI</strong> </p>
      <br>
      <p>- Team Synapse </p>
    `;
    await sendEmail(user.email, subject, html);

    console.log("✅ Payment verified for user:", user.email);

    return res.json({
      success: true,
      message: "Payment verified and plan updated",
      user: {
        name: user.name,
        email: user.email,
        isPremium: true,
      },
    });
  } catch (err) {
    console.error("Payment verification error:", err.message);
    res.status(500).json({ success: false, message: "Server error during payment verification" });
  }
};
