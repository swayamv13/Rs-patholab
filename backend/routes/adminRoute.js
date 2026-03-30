import express from 'express';
import appointmentModel from '../models/Appointment.js';
import HomeVisit from '../models/HomeVisit.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
    adminListTests,
    adminCreateTest,
    adminUpdateTest,
    adminDeleteTest,
    adminSeedDefaults
} from '../controllers/catalogController.js';

// Use backend working directory to avoid Windows path quirks with fileURLToPath.
const REPORTS_DIR = path.join(process.cwd(), 'uploads', 'reports');
fs.mkdirSync(REPORTS_DIR, { recursive: true });

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

// Get all appointments
adminRouter.get('/appointments', adminAuth, async (req, res) => {
    try {
        const appointments = await appointmentModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, appointments });
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
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, REPORTS_DIR),
        filename: (req, file, cb) => {
            const appointmentId = req.body?.appointmentId ? String(req.body.appointmentId) : 'unknown';
            const ext = path.extname(file.originalname || '').toLowerCase() || `.${file.mimetype.split('/')[1] || 'dat'}`;
            const safeExt = ext.replace(/[^a-z0-9.]/gi, '');
            const name = `report_${appointmentId}_${Date.now()}${safeExt}`;
            cb(null, name);
        }
    }),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
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

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const reportUrl = `/uploads/reports/${req.file.filename}`;
        await appointmentModel.findByIdAndUpdate(appointmentId, { reportUrl }, { new: true });

        res.json({ success: true, message: 'Report uploaded successfully.', reportUrl: `${baseUrl}${reportUrl}` });
    } catch (error) {
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

export default adminRouter;
