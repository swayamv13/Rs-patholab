import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    paymentMethod: { type: String, required: true }, // 'Cash' or 'Online'
    payment: { type: Boolean, default: false },
    razorpayOrderId: { type: String },
    // Admin sets this link (no upload UI in this version).
    // Example: a direct PDF URL or any downloadable file URL.
    reportUrl: { type: String, default: '' }
}, { timestamps: true });

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
export default appointmentModel;
