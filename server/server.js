import app from './app.js';
import { connectDB } from './config/db.js';
import { runSeed } from './utils/seedData.js';

const PORT = process.env.PORT || 5000;

// Connect Database, auto-seed default demo data if empty, then start HTTP listener
connectDB().then(async () => {
  try {
    await runSeed();
  } catch (err) {
    console.error('[Startup Seed Error]', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` SkillBridge AI Platform Backend Active on Port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server Port Conflict] Port ${PORT} is already in use by another running Node process.`);
      console.error(`[Server Port Conflict] Please close any other terminal instance or process on port ${PORT} before starting.`);
      process.exit(1);
    } else {
      console.error('[Server Error]', err);
    }
  });
});

