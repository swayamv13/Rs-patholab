import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getFirebaseAdmin = () => {
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
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'rs-pathlab.firebasestorage.app'
    });
    return admin;
};
