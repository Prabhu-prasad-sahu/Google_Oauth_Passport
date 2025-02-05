import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    is_varified: { type: Boolean, default: false },
    role: { type: [String], enum: ["user", "admin"], default: ["user"] },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;


