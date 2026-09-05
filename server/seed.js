import { connectDB, disconnectDB } from './config/db.js';
import { runSeed } from './utils/seedData.js';

const seedDatabase = async () => {
  try {
    // Attempt hitting running server's seed endpoint first
    try {
      const response = await fetch('http://localhost:5000/api/seed', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        console.log('[Seed] Seeded running server database successfully!');
        console.log(data.message);
        console.log('--------------------------------------------------');
        console.log(' SEED USER CREDENTIALS:');
        console.log(' Student:     student@skillbridge.edu     / Password@123 (or arun@skillbridge.com / Arun@123)');
        console.log(' Trainer:     trainer@skillbridge.edu     / Password@123');
        console.log(' Placement:   placement@skillbridge.edu   / Password@123');
        console.log(' Super Admin: admin@skillbridge.edu       / Password@123');
        console.log('--------------------------------------------------');
        process.exit(0);
      }
    } catch (apiErr) {
      // Backend server not listening on port 5000, fallback to direct DB connection
    }

    console.log('[Seed] Connecting directly to MongoDB database...');
    await connectDB();
    await runSeed(true);
    console.log('[Seed] Database Seeding Completed Successfully!');
    console.log('--------------------------------------------------');
    console.log(' SEED USER CREDENTIALS:');
    console.log(' Student:     student@skillbridge.edu     / Password@123 (or arun@skillbridge.com / Arun@123)');
    console.log(' Trainer:     trainer@skillbridge.edu     / Password@123');
    console.log(' Placement:   placement@skillbridge.edu   / Password@123');
    console.log(' Super Admin: admin@skillbridge.edu       / Password@123');
    console.log('--------------------------------------------------');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
