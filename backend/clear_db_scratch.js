import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = "mongodb+srv://RSPath:Rspath123@rspathlab.zshsghm.mongodb.net/rspathlab?appName=RSPathlab&retryWrites=true&w=majority";

async function clearDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected ✅');

        // Collections to clear
        const collections = ['users', 'appointments', 'homevisits'];

        for (const collName of collections) {
            console.log(`Clearing collection: ${collName}...`);
            await mongoose.connection.collection(collName).deleteMany({});
            console.log(`Cleared ${collName} ✅`);
        }

        console.log('\nSUCCESS: Database is now fresh! (Lab tests were preserved)');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing DB:', error);
        process.exit(1);
    }
}

clearDB();
