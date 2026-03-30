import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // For social logins, password may be empty.
    password: { type: String, default: '' },
    phone: { type: String },
    image: { type: String, default: '' },
    address: {
        line1: { type: String, default: '' },
        line2: { type: String, default: '' }
    },
    gender: { type: String, default: 'Male' },
    dob: { type: String, default: '' },
    familyMembers: [{
        name: { type: String },
        relation: { type: String },
        age: { type: String },
        gender: { type: String }
    }]
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
