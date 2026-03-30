import express from 'express';
import { registerUser, loginUser, firebaseLogin } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/firebase', firebaseLogin);

export default authRouter;
