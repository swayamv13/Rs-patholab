import express from 'express';
import { getProfile, updateProfile, addFamilyMember, getFamilyMembers, getUserAppointments } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import appointmentModel from '../models/Appointment.js';

const userRouter = express.Router();

userRouter.get('/profile', authUser, getProfile);
userRouter.put('/profile', authUser, updateProfile);
userRouter.post('/family', authUser, addFamilyMember);
userRouter.get('/family', authUser, getFamilyMembers);
userRouter.get('/appointments', authUser, getUserAppointments);

// Cancel appointment
userRouter.post('/cancel-appointment', authUser, async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointment = await appointmentModel.findOne({ _id: appointmentId, userId });
        if (!appointment) return res.json({ success: false, message: 'Appointment not found.' });
        if (appointment.payment) return res.json({ success: false, message: 'Paid appointments cannot be cancelled online. Please call us.' });
        await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'Cancelled' });
        res.json({ success: true, message: 'Appointment cancelled successfully.' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

export default userRouter;
