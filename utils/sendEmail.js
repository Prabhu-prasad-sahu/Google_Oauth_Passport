import transporter from "../config/emailConfig.js";
import EmailVerification from "../Model/emailVerification.js";

const sendEmailverificationOTP = async (req, user) => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const newOtpEntry = new EmailVerification({ userId: user._id, otp });
    await newOtpEntry.save();

    const verificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "OTP - Verify Your Email",
        text: `Dear ${user.name},\n\nThanks for signing up with us. Your OTP is ${otp}. 
        Please click on the link below to verify your email:\n\n${verificationLink}\n\nThis OTP will expire in 15 minutes.`,
        // html: `<p>Dear ${user.name},</p><p>Thanks for signing up with us. Your OTP is <b>${otp}</b>. Please click on the link below to verify your email:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>This OTP will expire in 15 minutes.</p>`,
    });

    return otp;
};

export default sendEmailverificationOTP;
