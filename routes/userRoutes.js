import express from 'express';
const Router = express.Router();
import userController from '../Controller/userController.js';


Router.post('/register', userController.userRegistation);
Router.post('/verifyemail', userController.verifyEmail);
Router.post("/login", userController.loginUser)
Router.post("/refreshToken", userController.getNewRefreshToken)

export default Router;

