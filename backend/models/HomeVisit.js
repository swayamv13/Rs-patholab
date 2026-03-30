import mongoose from 'mongoose';

const homeVisitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, default: 'pending' } // pending, contacted, completed
}, { timestamps: true });

const homeVisitModel = mongoose.models.homeVisit || mongoose.model('homeVisit', homeVisitSchema);
export default homeVisitModel;
