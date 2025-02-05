import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'Loginwithgoogle',
            serverSelectionTimeoutMS: 60000,
            autoCreate: false,
        });

        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error);
    }
};

export default connectDb;
