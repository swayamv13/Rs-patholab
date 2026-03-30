import appointmentModel from '../models/Appointment.js';

/** Pay-at-counter only: creates unpaid booking (admin marks paid later). */
const createBooking = async (req, res) => {
    try {
        const { userId, items, amount, address, date, time } = req.body;

        if (!items?.length || amount == null) {
            return res.json({ success: false, message: 'Invalid booking data' });
        }

        const newAppointment = new appointmentModel({
            userId,
            items,
            amount,
            address,
            date,
            time,
            paymentMethod: 'Cash',
            payment: false,
            status: 'Pending'
        });
        await newAppointment.save();

        res.json({ success: true, appointmentId: newAppointment._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createBooking };
