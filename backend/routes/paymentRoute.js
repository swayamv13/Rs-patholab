import express from 'express';
import { createBooking } from '../controllers/paymentController.js';
import authUser from '../middlewares/authUser.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-order', authUser, createBooking);

export default paymentRouter;
