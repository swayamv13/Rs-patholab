import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import path from 'path';

// Import Routes
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import visitRouter from './routes/visitRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import adminRouter from './routes/adminRoute.js';
import catalogRouter from './routes/catalogRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 5000;
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Local static uploads removed in favor of Firebase Storage

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/visits', visitRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('RS Path Lab API Working ✅');
});

// Conditionally listen locally or in standard environments, but Vercel will handle it personally.
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server started on PORT : ${port}`);
    });
}

export default app; // Added for Vercel compatibility
