import userModel from "../Model/User.js"; // Ensure correct file path & extension
import bcrypt from "bcrypt";
import sendEmailverificationOTP from "../utils/sendEmail.js";
import EmailVerification from "../Model/emailVerification.js";
import generateToken from "../utils/genarateToken.js";
import setTokenCookies from "../utils/setTokenCookies.js";
import refresAccessToken from "../utils/refreshToken.js";
import { access, stat } from "fs";

class userController {
    static async userRegistation(req, res) {
        try {
            const { name, email, password, password_confirmation } = req.body;

            if (!name || !email || !password || !password_confirmation) {
                return res.status(400).json({ status: "failed", message: "All fields are required" });
            }

            if (password !== password_confirmation) {
                return res.status(400).json({ status: "failed", message: "Password and confirm password does not match" });
            }

            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ status: "failed", message: "Email already exists" });
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = await new userModel({
                name,
                email,
                password: hashPassword
            }).save();
            sendEmailverificationOTP(req, newUser);
            res.status(201).json({
                status: "success",
                message: "User created successfully",
                user: { id: newUser._id, email: newUser.email }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: "Internal server error" });
        }
    }
    static async verifyEmail(req, res) {
        try {
            const { otp, email } = req.body;
            if (!otp || !email) {
                return res.status(400).json({ status: "failed", message: "all field are required" });
            }
            const existingUser = await userModel.findOne({ email });
            if (existingUser.is_varified) {
                return res.status(400).json({ status: "failed", message: "Email already verified" });
            }
            if (!existingUser) {
                return res.status(404).json({ status: "failed", message: "Email doesnt exist    " });
            }
            const emailVerification = await EmailVerification.findOne({ userId: existingUser._id });
            if (!emailVerification) {
                if (!existingUser.is_varified) {
                    await sendEmailverificationOTP(req, existingUser);
                    return res.status(400).json({ status: "failed", message: "Invalid OTP,new otp sent to your email" });
                }
            }
            if (emailVerification.otp !== otp) {
                return res.status(400).json({ status: "failed", message: "Invalid OTP" });
            }
            existingUser.is_varified = true;
            await existingUser.save();
            await EmailVerification.deleteOne({ otp });
            res.status(200).json({ status: "success", message: "Email verified successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: "Internal server error" });
        }
    }
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ status: "failed", message: "all field required" })
            }
            let existingUser = await userModel.findOne({ email });
            if (!existingUser) {
                return res.status(400).json({ status: "failed", message: "invalid Email" })
            }
            if (!existingUser.is_varified) {
                return res.status(400).json({ status: "failed", message: "you are not Verifyed please Verify your email" })
            }
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({ status: "failed", message: "Invalid Password" })
            };
            const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateToken(existingUser);
            setTokenCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp)
            return res.status(200).json({
                user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, roles: existingUser.roles },
                status: "sucess",
                message: "login sucessfully",
                acces_Token: accessToken,
                refresh_Token: refreshToken,
                acces_Token_Exp: accessTokenExp,
                refresh_Token_Exp: refreshTokenExp,
                is_auth: true
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: "Internal server error" });
        }
    }
    static async getNewRefreshToken(req, res) {
        try {
            const { NewAccessToken, NewRefreshToken, NewAccessTokenExp, NewRefreshTokenExp } = await refresAccessToken(req, res);
            setTokenCookies(res, NewAccessToken, NewRefreshToken, NewAccessTokenExp, NewRefreshTokenExp);
            res.status(200).json({
                status: "success",
                message: "New access token generated successfully",
                access_Token: NewAccessToken,
                refresh_Token: NewRefreshToken,
                access_Token_Exp: NewAccessTokenExp,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "failed", message: "Internal server error    " });
        }
    }
}

export default userController;
