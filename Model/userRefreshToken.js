import mongoose from "mongoose";


const userRefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    blackListed: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "5d",
    }
});

const UserRefreshTokenModel = mongoose.model("UserRefreshToken", userRefreshTokenSchema);
export default UserRefreshTokenModel;
