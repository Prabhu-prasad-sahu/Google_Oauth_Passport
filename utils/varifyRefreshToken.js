import UserRefreshTokenModel from "../Model/userRefreshToken.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async (refreshToken) => {
    try {
        const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

        const userRefreshToken = await UserRefreshTokenModel.findOne({ token: refreshToken });
        if (!userRefreshToken) {
            throw new Error("Invalid token");
        }
        const tokenDetails = jwt.verify(refreshToken, privateKey);

        return {
            tokenDetails,
            error: false,
            message: "Token verified successfully",
        };
    } catch (error) {
        console.error("Error verifying refresh token:", error.message);
        return { error: true, message: error.message || "Invalid refresh token" };
    }
};

export default verifyRefreshToken;
