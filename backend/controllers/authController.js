import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userModel from '../models/User.js';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFirebaseAdmin = () => {
    if (admin.apps.length) return admin;

    let serviceAccount = null;

    const rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (rawEnv) {
        try {
            serviceAccount = JSON.parse(rawEnv);
        } catch {
            return null;
        }
    } else {
        const filePath =
            process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
            path.join(__dirname, '..', 'firebase-service-account.json');
        if (fs.existsSync(filePath)) {
            try {
                serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch {
                return null;
            }
        }
    }

    if (!serviceAccount) return null;

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    return admin;
};

const createJwt = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET);

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = createJwt(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        if (!user.password) {
            return res.json({ success: false, message: 'This account uses Google sign-in. Please use Continue with Google.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createJwt(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Firebase (Google) Login
const firebaseLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.json({ success: false, message: 'Missing idToken' });

        const firebaseAdmin = getFirebaseAdmin();
        if (!firebaseAdmin) {
            return res.json({
                success: false,
                message:
                    'Google sign-in is not configured on the server. Add `backend/firebase-service-account.json` (gitignored) or set `FIREBASE_SERVICE_ACCOUNT_JSON` in backend `.env`.'
            });
        }

        const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
        const email = decoded.email;
        const name = decoded.name || decoded.email?.split('@')[0] || 'User';
        const picture = decoded.picture || '';

        if (!email) return res.json({ success: false, message: 'Firebase token missing email' });

        let user = await userModel.findOne({ email });
        if (!user) {
            // Create user with empty password (social account)
            user = await userModel.create({ name, email, password: '', image: picture });
        } else {
            // Keep profile somewhat fresh
            const updates = {};
            if (picture && !user.image) updates.image = picture;
            if (name && (!user.name || user.name === 'User')) updates.name = name;
            if (Object.keys(updates).length) await userModel.findByIdAndUpdate(user._id, updates);
        }

        const token = createJwt(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || 'Firebase login failed' });
    }
};

export { registerUser, loginUser, firebaseLogin };
