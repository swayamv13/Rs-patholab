import mongoose from 'mongoose';

const chatbotLeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    testName: { type: String, required: true },
    status: { type: String, default: 'Pending' } // Pending, Contacted, Booked
}, { timestamps: true });

const chatbotLeadModel = mongoose.models.chatbotLead || mongoose.model('chatbotLead', chatbotLeadSchema);
export default chatbotLeadModel;
