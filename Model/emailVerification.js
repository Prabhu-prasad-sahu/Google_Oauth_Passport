import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900, // The OTP expires after 15 minutes (900 seconds)
    }
});

// Correct way to create and export a Mongoose model
const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);
export default EmailVerification;
