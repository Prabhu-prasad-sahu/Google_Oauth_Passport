import userModel from "../Model/User.js";
import UserRefreshTokenModel from "../Model/userRefreshToken.js";
import generateToken from "./genarateToken.js";
import verifyRefreshToken from "./varifyRefreshToken.js";

const refresAccessToken = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) {
            return res.status(400).json({ status: "failed", message: "Please login first" });
        }

        const { tokenDetails, error, message } = await verifyRefreshToken(oldRefreshToken);

        if (error) {
            return res.status(401).json({ status: "failed", message: message || "Invalid refresh token" });
        }

        const user = await userModel.findById(tokenDetails._id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        const userrefreshToken = await UserRefreshTokenModel.findOne({ userId: tokenDetails._id });
        if (oldRefreshToken !== userrefreshToken.token || userrefreshToken.blackListed) {
            return res.status(401).json({ status: "failed", message: "Unauthorized access" });
        }

        const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateToken(user);

        res.status(200).json({
            newAccessToken: accessToken,
            newRefreshToken: refreshToken,
            newAccessTokenExp: accessTokenExp,
            newRefreshTokenExp: refreshTokenExp,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal server error" });
    }
}

export default refresAccessToken;
