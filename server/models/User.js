import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    code: String,
    expiresAt: Date,
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        otp: otpSchema,
        isPremium: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
