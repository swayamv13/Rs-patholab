import express from 'express';
import appointmentModel from '../models/Appointment.js';
import HomeVisit from '../models/HomeVisit.js';
import chatbotLeadModel from '../models/ChatbotLead.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import cloudinary from '../config/cloudinary.js';

// Helper: is Cloudinary configured?
const hasCloudinary = () =>
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

// Upload buffer to Cloudinary and return secure URL
const uploadBufferToCloudinary = (buffer, mimetype) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'rs-pathlab-reports', resource_type: 'auto' },
            (err, result) => err ? reject(err) : resolve(result.secure_url)
        );
        stream.end(buffer);
    });
import {
    adminListTests,
    adminCreateTest,
    adminUpdateTest,
    adminDeleteTest,
    adminSeedDefaults
} from '../controllers/catalogController.js';

const adminRouter = express.Router();

// Simple admin auth middleware
const adminAuth = (req, res, next) => {
    const token = req.headers['admintoken'];
    if (token === 'rs_admin_authenticated') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

// Get appointments — with pagination, search and filter support
adminRouter.get('/appointments', adminAuth, async (req, res) => {
    try {
        const page    = Math.max(1, parseInt(req.query.page)  || 1);
        const limit   = Math.max(1, parseInt(req.query.limit) || 15);
        const search  = (req.query.search  || '').trim();
        const filter  = (req.query.filter  || 'all').trim();

        // Build a base match
        let match = {};
        if (filter === 'paid')      match.payment = true;
        if (filter === 'pending')   match = { ...match, payment: false, status: { $ne: 'Cancelled' } };
        if (filter === 'cancelled') match.status = 'Cancelled';

        // Text search across patient name, phone
        if (search) {
            match.$or = [
                { 'address.name':  { $regex: search, $options: 'i' } },
                { 'address.phone': { $regex: search, $options: 'i' } },
            ];
        }

        const total = await appointmentModel.countDocuments(match);
        const appointments = await appointmentModel
            .find(match)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ success: true, appointments, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Get all home visit requests
adminRouter.get('/visits', adminAuth, async (req, res) => {
    try {
        const visits = await HomeVisit.find({}).sort({ createdAt: -1 });
        res.json({ success: true, visits });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Get all chatbot leads
adminRouter.get('/chatbot-leads', adminAuth, async (req, res) => {
    try {
        const leads = await chatbotLeadModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, leads });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Mark appointment as paid
adminRouter.post('/mark-paid', adminAuth, async (req, res) => {
    try {
        const { appointmentId } = req.body;
        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true, status: 'Confirmed' });
        res.json({ success: true, message: 'Appointment marked as paid.' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Set report download URL (no upload UI in this version)
adminRouter.post('/set-report-url', adminAuth, async (req, res) => {
    try {
        const { appointmentId, reportUrl } = req.body;
        if (!appointmentId) return res.json({ success: false, message: 'appointmentId missing' });
        if (!reportUrl || typeof reportUrl !== 'string') return res.json({ success: false, message: 'reportUrl missing' });

        const appt = await appointmentModel.findById(appointmentId);
        if (!appt) return res.json({ success: false, message: 'Appointment not found' });
        if (!appt.payment) {
            return res.json({ success: false, message: 'Mark payment as paid first before setting report link.' });
        }

        await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { reportUrl: reportUrl.trim() },
            { new: false }
        );
        res.json({ success: true, message: 'Report link saved.' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Upload report file (PDF/JPG/PNG/etc) and save as appointment.reportUrl
adminRouter.post('/upload-report', adminAuth, multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB to avoid MongoDB BsonSizeError
    fileFilter: (_req, file, cb) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            cb(new Error('Only PDF or image files are allowed.'));
            return;
        }
        cb(null, true);
    }
}).single('reportFile'), async (req, res) => {
    try {
        const { appointmentId } = req.body || {};
        if (!appointmentId) return res.json({ success: false, message: 'appointmentId missing' });

        const appt = await appointmentModel.findById(appointmentId);
        if (!appt) return res.json({ success: false, message: 'Appointment not found' });

        if (!appt.payment) {
            return res.json({ success: false, message: 'Mark payment as paid first before uploading report.' });
        }

        if (!req.file) {
            return res.json({ success: false, message: 'reportFile missing' });
        }

        let reportUrl;
        if (hasCloudinary()) {
            // ✅ Cloudinary — store as persistent public URL
            reportUrl = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
        } else {
            // ⚠️  Fallback — Base64 in MongoDB (add CLOUDINARY_* env vars to switch)
            const base64Data = req.file.buffer.toString('base64');
            reportUrl = `data:${req.file.mimetype};base64,${base64Data}`;
            console.warn('[upload-report] Cloudinary not configured — using Base64 fallback. Large files may hit MongoDB size limits.');
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { reportUrl }, { new: true });

        const storageBackend = hasCloudinary() ? 'Cloudinary' : 'MongoDB (Base64)';
        res.json({ success: true, message: `Report uploaded via ${storageBackend}.`, reportUrl });
    } catch (error) {
        console.error('Upload Error: ', error);
        res.json({ success: false, message: error.message || 'Upload failed' });
    }
});

// Lab catalog (tests & rates)
adminRouter.get('/tests', adminAuth, adminListTests);
adminRouter.post('/tests', adminAuth, adminCreateTest);
adminRouter.put('/tests/:id', adminAuth, adminUpdateTest);
adminRouter.delete('/tests/:id', adminAuth, adminDeleteTest);
adminRouter.post('/tests/seed-defaults', adminAuth, adminSeedDefaults);

// Cancel an appointment
adminRouter.post('/cancel-appointment', adminAuth, async (req, res) => {
    try {
        const { appointmentId } = req.body;
        await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'Cancelled' });
        res.json({ success: true, message: 'Appointment cancelled.' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// ----------------------------------------------------------------
// Dashboard stats — all-time numbers for charts (no pagination)
// ----------------------------------------------------------------
adminRouter.get('/stats', adminAuth, async (req, res) => {
    try {
        const all = await appointmentModel.find({}, 'amount payment status createdAt items date').lean();

        const totalRevenue = all.filter(a => a.payment).reduce((s, a) => s + (a.amount || 0), 0);
        const paid         = all.filter(a => a.payment).length;
        const pending      = all.filter(a => !a.payment && a.status !== 'Cancelled').length;
        const cancelled    = all.filter(a => a.status === 'Cancelled').length;

        // Last-7-days per-day breakdown
        const last7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            return d;
        });
        const daily = last7.map(d => {
            const next = new Date(d); next.setDate(d.getDate() + 1);
            const dayAppts = all.filter(a => {
                const c = new Date(a.createdAt);
                return c >= d && c < next;
            });
            return {
                label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                revenue: dayAppts.filter(a => a.payment).reduce((s, a) => s + (a.amount || 0), 0),
                bookings: dayAppts.length
            };
        });

        // Top-5 tests by booking count
        const testCount = {};
        all.forEach(a => (a.items || []).forEach(i => {
            testCount[i.name] = (testCount[i.name] || 0) + 1;
        }));
        const topTests = Object.entries(testCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

        res.json({ success: true, total: all.length, totalRevenue, paid, pending, cancelled, daily, topTests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// ----------------------------------------------------------------
// Staff accounts — lightweight RBAC
// STAFF_ACCOUNTS env var format: "user:pass:role,user2:pass2:role2"
// Roles: superadmin | receptionist | technician
// ----------------------------------------------------------------
adminRouter.post('/staff-login', async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) return res.json({ success: false, message: 'Credentials required.' });

        // Hardcoded superadmin token (backward-compat)
        if (username === 'admin' && password === 'rs_admin_authenticated') {
            return res.json({ success: true, token: 'rs_admin_authenticated', role: 'superadmin', name: 'Admin' });
        }

        // Parse staff accounts from env
        const raw = process.env.STAFF_ACCOUNTS || '';
        const staff = raw.split(',').map(s => {
            const [u, p, r] = s.split(':');
            return { username: u, password: p, role: r || 'receptionist' };
        }).filter(s => s.username && s.password);

        const match = staff.find(s => s.username === username && s.password === password);
        if (!match) return res.json({ success: false, message: 'Invalid credentials.' });

        res.json({ success: true, token: 'rs_admin_authenticated', role: match.role, name: match.username });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

export default adminRouter;
