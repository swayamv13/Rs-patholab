import userModel from '../models/User.js';

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');

        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, userData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, gender, dob } = req.body;

        if (!name || !phone || !gender || !dob) {
            return res.json({ success: false, message: 'Data Missing' });
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address, gender, dob });

        res.json({ success: true, message: 'Profile Updated' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to add family member
const addFamilyMember = async (req, res) => {
    try {
        const { userId, name, relation, age, gender } = req.body;

        if (!name || !relation || !age || !gender) {
            return res.json({ success: false, message: 'Data Missing' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        user.familyMembers.push({ name, relation, age, gender });
        await user.save();

        res.json({ success: true, message: 'Family Member Added', familyMembers: user.familyMembers });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get family members
const getFamilyMembers = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, familyMembers: user.familyMembers });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user appointments
import appointmentModel from '../models/Appointment.js';

const getUserAppointments = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getProfile, updateProfile, addFamilyMember, getFamilyMembers, getUserAppointments };
