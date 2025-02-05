import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookeparser from 'cookie-parser';
import connectDb from './config/connection.js';
import passport from 'passport';
import userRouter from './routes/userRoutes.js';
dotenv.config()
let app = express();

const corsOption = {
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200
}
connectDb(process.env.MONGODB_URL);
app.use(cors(corsOption));
app.use(express.json());
app.use(cookeparser());
app.use(passport.initialize());
app.use("/api/user", userRouter);


const port = process.env.PORT
console.log(port)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
