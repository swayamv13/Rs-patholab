import { getFirebaseAdmin } from './config/firebaseAdmin.js';

async function checkBuckets() {
    try {
        const admin = getFirebaseAdmin();
        if (!admin) {
            console.log('No admin');
            return;
        }
        const [buckets] = await admin.storage().bucket().storage.getBuckets();
        console.log('Available buckets:');
        buckets.forEach(b => console.log(b.name));
    } catch (e) {
        console.error('Error fetching buckets:', e.message);
    }
}

checkBuckets();
